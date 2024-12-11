import { readSettings } from '#lib/Database/settings/functions';
import { StarboardManager } from '#lib/structures';
import { EnvKeys, GuildMessage } from '#lib/types';
import { defaultStarboardEmojis } from '#utils/discord';
import { getGuildStarboard } from '#utils/functions';
import { fetchReactionUsers, floatPromise, getAttachment, getImage, isVideo, resolveClientColor } from '#utils/util';
import { starboard } from '@prisma/client';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { MessageOptions } from '@sapphire/plugin-editable-commands';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import { cast, cutText, debounce, isNullish } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { bold, Client, DiscordAPIError, EmbedBuilder, HTTPError, Message, MessageEditOptions, RESTJSONErrorCodes, TextChannel } from 'discord.js';

export type StarboardData = starboard;

export async function getStarboard(guildId: string, messageId: string) {
	const { starboard } = container.prisma;
	const previous = await starboard.findFirst({ where: { guildId: guildId, messageId: messageId } });
	if (!previous) return null;

	const channel =
		container.client.channels.cache.get(previous.channelId!) || (await resolveToNull(container.client.channels.fetch(previous.channelId!)));
	if (!channel || !channel.isSendable()) return null;

	const message = channel.messages.cache.get(messageId) || (await resolveToNull(channel.messages.fetch(messageId)));
	if (!message || !message.inGuild()) return null;

	return previous ? new Starboard(previous).init(getGuildStarboard(guildId), cast<GuildMessage>(message)) : null;
}

export function truncateStarboardEmojis(settings: readonly string[], fallback: string[] = defaultStarboardEmojis) {
	console.log(new Set([...settings, ...fallback]));
	return ['%E2%AD%90'];
}

export async function combineMessageReactionUsers(emojis: string[], ...messages: (GuildMessage | null)[]) {
	const users = [];

	for (const message of messages) {
		if (!message) continue;
		const userResult = await fetchReactionUsers(message.channel.id, message.id, emojis);
		users.push(...userResult);
	}

	return users;
}

export class Starboard {
	#users = new Set<string>();
	#manager: StarboardManager = null!;
	#client: Client = container.client;
	#message: GuildMessage = null!;
	#starMessage: GuildMessage | null = null;
	#updateStarMessage = debounce(this.updateStarMessage.bind(this), { wait: 2500, maxWait: 10000 });

	public id: number = null!;

	public enabled = true;

	public userId: string = null!;

	public messageId: string = null!;

	public channelId: string = null!;

	public guildId: string = null!;

	public starChannelId: string | null = null;

	public starMessageId: string | null = null;

	public stars = 0;

	public lastUpdated = Date.now();

	public constructor(data?: Partial<StarboardData>) {
		Object.assign(this, data);
	}

	public setup(manager: StarboardManager) {
		this.#manager = manager;
		if (this.userId) void floatPromise(this.#client.users.fetch(this.userId));
		return this;
	}

	public init(manager: StarboardManager, message: GuildMessage) {
		this.setup(manager);
		this.#message = message;
		this.messageId = message.id;
		this.channelId = message.channel.id;
		this.guildId = manager.guild.id;
		this.userId = message.author.id;
		return this;
	}

	public async disable(): Promise<boolean> {
		if (!this.enabled) return false;
		await this.edit({ enabled: false });
		return true;
	}

	public async enable(): Promise<boolean> {
		if (this.enabled) return false;
		await this.edit({ enabled: true });
		await this.downloadUserList();
		return true;
	}

	public async increment(id: string, selfStarring: boolean): Promise<void> {
		if (this.#message.author.id === id && !selfStarring) return;
		this.#users.add(id);
		await this.edit({ stars: this.#users.size });
	}

	public async decrement(id: string): Promise<void> {
		this.#users.delete(id);
		await this.downloadUserList();
		await this.edit({ stars: this.#users.size });
	}

	public async edit(options: Partial<Starboard>): Promise<this> {
		this.lastUpdated = Date.now();

		// If a message was in progress to be sent, await it first
		const previousUpdate = this.#manager.syncMessageMap.get(this);
		if (previousUpdate) await previousUpdate;

		if (Reflect.has(options, 'enabled')) {
			this.enabled = options.enabled!;
		}
		if (Reflect.has(options, 'stars') && this.enabled) {
			this.stars = options.stars!;
			await this.#updateStarMessage();
		}
		if (options.starMessageId === null) {
			this.starMessageId = null;
			this.#starMessage = null;
		}

		await this.update();
		return this;
	}

	public async downloadStarMessage(): Promise<void> {
		if (!this.starMessageId) return;

		const { starChannelId } = this;
		if (isNullish(starChannelId)) return;

		const channel = cast<TextChannel | undefined>(this.#message.guild.channels.cache.get(starChannelId));
		if (isNullish(channel)) return;

		try {
			this.#starMessage = cast<GuildMessage>(await channel.messages.fetch(this.starMessageId));
		} catch (error) {
			if (error instanceof DiscordAPIError) {
				if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.remove();
			}
		}
	}

	public get starMessageURL() {
		if (!this.#starMessage) return null;
		return this.#starMessage.url;
	}

	public async downloadUserList(): Promise<void> {
		try {
			const { starboardEmojis, starboardSelfStar } = await readSettings(this.#message.guild);

			const fetchedUsers = await combineMessageReactionUsers(truncateStarboardEmojis(starboardEmojis), this.#message, this.#starMessage);
			this.#users = new Set(fetchedUsers.filter((user) => user !== envParseString(EnvKeys.ClientId)));

			// Remove the author's star if self star is disabled:
			if (!starboardSelfStar) this.#users.delete(this.#message.author.id);
		} catch (error) {
			if (error instanceof DiscordAPIError) {
				if (error.code === RESTJSONErrorCodes.MissingAccess) return;
				if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.remove();
				return;
			}
		}

		if (!this.#users.size) {
			await this.remove();
			return;
		}

		this.stars = this.#users.size;
	}

	public async getStarContent(t: TFunction): Promise<MessageOptions | MessageEditOptions> {
		const color = await this.color();

		const message = this.#message;
		const attachment = getAttachment(message);
		const video = isVideo(attachment);

		const options: { embeds: EmbedBuilder[]; content: null | string } = { embeds: [], content: null };

		const starMessageEmbed = new EmbedBuilder()
			.setAuthor({
				name: message.member?.displayName || message.author.username,
				iconURL: message.member?.displayAvatarURL() || message.author.displayAvatarURL()
			})
			.setColor(color)
			.setImage(getImage(message)!)
			.setDescription(await this.getContent(t))
			.setTimestamp(message.createdTimestamp)
			.setFooter({ text: `Star #${this.id?.toLocaleString() || -1}` });
		const embeds: EmbedBuilder[] = [starMessageEmbed];

		await this.addRefrencedEmbeds(embeds, message);

		if (video && attachment) {
			options.content = attachment.url;
		}

		return { ...options, embeds };
	}

	private async addRefrencedEmbeds(embeds: EmbedBuilder[], message: GuildMessage = this.#message) {
		if (
			embeds.length <= 9 &&
			message.reference &&
			message.reference.messageId &&
			message.reference.guildId &&
			message.reference.channelId === message.channelId &&
			message.reference.guildId === message.guildId
		) {
			const referencedGuild = await container.client.guilds.fetch(message.reference.guildId!);
			const referencedChannel = await referencedGuild.channels.fetch(message.reference.channelId);

			if (referencedChannel?.isTextBased()) {
				const referencedMessage = await referencedChannel.messages.fetch(message.reference.messageId);

				const embedOfReferencedMessage = new EmbedBuilder()
					.setAuthor({
						name: `Replying to ${referencedMessage.member?.displayName || referencedMessage.author.username}`,
						iconURL: referencedMessage.member?.displayAvatarURL() || referencedMessage.author.displayAvatarURL()
					})
					.setColor(await this.refrencedColor(referencedMessage))
					.setImage(getImage(referencedMessage)!)
					.setDescription(
						`${referencedMessage.content || ''}${referencedMessage ? `\n\n[Jump to Refrenced Message](${referencedMessage.url})` : ''}`
					);

				embeds.unshift(embedOfReferencedMessage);

				if (referencedMessage.reference) {
					await this.addRefrencedEmbeds(embeds, referencedMessage as GuildMessage);
				}
			}
		}
	}

	private async color() {
		const guild = this.#client.guilds.cache.get(this.guildId);
		if (!guild) return resolveClientColor(this.#message.guild);
		const member = await resolveToNull(guild.members.fetch(this.userId));
		if (!member) return resolveClientColor(this.#message.guild);

		return member.displayColor || resolveClientColor(this.#message.guild);
	}

	private async refrencedColor(ref: Message) {
		const guild = this.#client.guilds.cache.get(this.guildId);
		if (!guild) return resolveClientColor(this.#message.guild);
		const member = await resolveToNull(guild.members.fetch(ref.author.id));
		if (!member) return resolveClientColor(this.#message.guild);
		return member.displayColor || resolveClientColor(this.#message.guild);
	}

	private async getContent(_: TFunction) {
		const url = await this.getUrl();
		return [cutText(this.#message.content, 1800), '', url].join('\n');
	}

	private getUrl() {
		const url = `${this.emoji} ${bold(this.stars.toString())} | <#${this.channelId}> | [Jump to Message](${this.#message.url})`;
		return url;
	}

	private async updateStarMessage(): Promise<void> {
		const { starboardMinimum, starboardChannelId } = await readSettings(this.#message.guild);
		const t = await fetchT(this.#message);

		// If number of stars is 0 try to delete the starmessage and db entry.
		if (this.stars === 0 && this.#starMessage) {
			try {
				if (this.#starMessage.author.id !== envParseString(EnvKeys.ClientId)) return;
				// await this.#starMessage.delete();
				// await this.remove();
				console.log('try delete');
				return;
			} catch (error) {
				if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

				if (error.code === RESTJSONErrorCodes.MissingAccess) return;
				if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.edit({ starMessageId: null, enabled: false });
			}
		}

		// if number of reactions is less than the minimum or there is no channelId return;
		if (this.stars < starboardMinimum || isNullish(starboardChannelId)) return;

		// if existing starmessage try to update
		if (this.#starMessage) {
			try {
				const options = await this.getStarContent(t);
				await this.#starMessage.edit(options as MessageEditOptions);
			} catch (error) {
				if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

				if (error.code === RESTJSONErrorCodes.MissingAccess) return;
				if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.edit({ starMessageId: null, enabled: false });
			}

			return;
		}

		// if message author is bot then return;
		if (this.#message.author.bot) return;

		// fetch the starboard channel;
		const channel = cast<TextChannel | undefined>(this.#message.guild.channels.cache.get(starboardChannelId));
		if (!channel) return;

		const options = await this.getStarContent(t);
		const promise = channel
			.send({ embeds: options.embeds!, content: options.content ?? undefined })
			.then((message) => {
				this.#starMessage = cast<GuildMessage>(message);
				this.starMessageId = message.id;
				this.starChannelId = message.channel.id;
			})
			.catch((error) => {
				if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

				if (error.code === RESTJSONErrorCodes.MissingAccess) return;
				// Emit to console
				container.logger.fatal(error);
			})
			.finally(async () => {
				this.#manager.syncMessageMap.delete(this);
				// if the message was created react on it
				if (this.#starMessage) await floatPromise(this.#starMessage.react('%E2%AD%90'));
				// save to db
				await this.save();
			});

		this.#manager.syncMessageMap.set(this, promise);
		await promise;
	}

	private async remove() {
		await container.prisma.starboard.delete({
			where: {
				messageId_guildId: { messageId: this.messageId, guildId: this.guildId }
			}
		});
	}

	private async update() {
		await container.prisma.starboard.update({
			where: {
				messageId_guildId: {
					messageId: this.messageId,
					guildId: this.guildId
				}
			},
			data: {
				id: this.id,
				enabled: this.enabled,
				userId: this.userId,
				messageId: this.messageId,
				channelId: this.channelId,
				guildId: this.guildId,
				starChannelId: this.starChannelId,
				starMessageId: this.starMessageId,
				stars: this.stars
			}
		});
	}

	private async save() {
		await container.prisma.starboard.create({
			data: {
				id: this.id,
				enabled: this.enabled,
				userId: this.userId,
				messageId: this.messageId,
				channelId: this.channelId,
				guildId: this.guildId,
				starChannelId: this.starChannelId,
				starMessageId: this.starMessageId,
				stars: this.stars
			}
		});
	}

	public get emoji() {
		const { stars } = this;
		if (stars < 5) return '⭐';
		if (stars < 10) return '🌟';
		if (stars < 15) return '💫';
		if (stars < 20) return '✨';
		if (stars < 25) return '🌠';
		return '🌌';
	}
}
