import { starboard } from '@prisma/client';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { MessageOptions } from '@sapphire/plugin-editable-commands';
import { fetchT } from '@sapphire/plugin-i18next';
import { cast, cutText, debounce, isNullish } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { SettingsKeys } from '#lib/database';
import { readSettings } from '#lib/database/settings/functions';
import { EnvKeys, FTFunction, GuildMessage } from '#lib/types';
import { floatPromise } from '#utils/common';
import { defaultStarboardEmojis, getGuildStarboard, resolveClientColor } from '#utils/functions';
import { fetchReactionUsers, getAttachment, getImage, isVideo } from '#utils/util';
import { bold, Client, DiscordAPIError, EmbedBuilder, HTTPError, Message, MessageEditOptions, RESTJSONErrorCodes, TextChannel } from 'discord.js';

import { StarboardManager } from './StarboardManager.js';

export type StarboardData = starboard;

const CONTENTMAP = new Map<string, string>();

export class StarboardEntry {
	public channelId: string = null!;
	public enabled = true;
	public guildId: string = null!;
	public id: number = null!;
	public lastUpdated = Date.now();
	public messageId: string = null!;

	public starChannelId: null | string = null;

	public starMessageId!: string;

	public stars = 0;

	public userId: string = null!;

	#client: Client = container.client;

	#manager: StarboardManager = null!;

	#message: GuildMessage = null!;

	#starMessage: GuildMessage | null = null;

	#updateStarMessage = debounce(this.updateStarMessage.bind(this), { maxWait: 10000, wait: 2500 });

	#users = new Set<string>();

	public constructor(data?: Partial<StarboardData>) {
		Object.assign(this, data);
	}

	public async decrement(id: string): Promise<void> {
		this.#users.delete(id);
		await this.downloadUserList();
		await this.edit({ stars: this.#users.size });
	}

	public async disable(): Promise<boolean> {
		if (!this.enabled) return false;
		await this.edit({ enabled: false });
		return true;
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

	public async edit(options: Partial<StarboardEntry>): Promise<this> {
		this.lastUpdated = Date.now();

		// If a message was in progress to be sent, await it first
		const previousUpdate = this.#manager.syncMessageMap.get(this);
		if (previousUpdate) await previousUpdate;

		if (Reflect.has(options, 'enabled')) {
			this.enabled = options.enabled!;
			if (this.starMessageId) await this.update();
		}
		if (Reflect.has(options, 'stars') && this.enabled) {
			this.stars = options.stars!;
			await this.#updateStarMessage();
			await this.update();
		}

		return this;
	}

	public async enable(): Promise<boolean> {
		if (this.enabled) return false;
		await this.edit({ enabled: true });
		await this.downloadUserList();
		return true;
	}

	public async getStarContent(t: FTFunction): Promise<MessageEditOptions | MessageOptions> {
		const color = await this.color();

		const message = this.#message;
		const attachment = getAttachment(message);
		const video = isVideo(attachment);

		const options: { content: null | string; embeds: EmbedBuilder[] } = { content: null, embeds: [] };

		const starMessageEmbed = new EmbedBuilder()
			.setAuthor({
				iconURL: message.member?.displayAvatarURL() || message.author.displayAvatarURL(),
				name: message.member?.displayName || message.author.username
			})
			.setColor(color)
			.setImage(attachment?.proxyURL ?? (attachment?.url || null))
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

	public async increment(id: string, selfStarring: boolean): Promise<void> {
		if (this.#message.author.id === id && !selfStarring) return;
		this.#users.add(id);
		await this.edit({ stars: this.#users.size });
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

	public setup(manager: StarboardManager) {
		this.#manager = manager;
		if (this.userId) void floatPromise(this.#client.users.fetch(this.userId));
		return this;
	}

	async #fetchNextId() {
		const star = await container.prisma.starboard.findFirst({ orderBy: { id: 'desc' }, where: { guildId: this.guildId } });
		// if no stars in server start from 1
		if (!star) return 1;
		return star.id! + 1;
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
						iconURL: referencedMessage.member?.displayAvatarURL() || referencedMessage.author.displayAvatarURL(),
						name: `Replying to ${referencedMessage.member?.displayName || referencedMessage.author.username}`
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

	private async getContent(_: FTFunction) {
		const url = await this.getUrl();
		const gotContent = CONTENTMAP.get(this.#message.id);
		return [cutText(gotContent || this.#message.content, 1800), '', url].join('\n');
	}

	private getUrl() {
		const url = `${this.emoji} ${bold(this.stars.toString())} | <#${this.channelId}> | [Jump to Message](${this.#message.url})`;
		return url;
	}

	private async refrencedColor(ref: Message) {
		const guild = this.#client.guilds.cache.get(this.guildId);
		if (!guild) return resolveClientColor(this.#message.guild);
		const member = await resolveToNull(guild.members.fetch(ref.author.id));
		if (!member) return resolveClientColor(this.#message.guild);
		return member.displayColor || resolveClientColor(this.#message.guild);
	}

	private async remove() {
		await container.prisma.starboard.delete({
			where: {
				messageId_guildId_starMessageId: { guildId: this.guildId, messageId: this.messageId, starMessageId: this.starMessageId! }
			}
		});
	}

	private async save() {
		await container.prisma.starboard.create({
			data: {
				channelId: this.channelId,
				enabled: this.enabled,
				guildId: this.guildId,
				id: this.id,
				messageId: this.messageId,
				starChannelId: this.starChannelId,
				starMessageId: this.starMessageId!,
				stars: this.stars,
				userId: this.userId
			}
		});
	}

	private async update() {
		await container.prisma.starboard.update({
			data: {
				channelId: this.channelId,
				enabled: this.enabled,
				guildId: this.guildId,
				id: this.id,
				messageId: this.messageId,
				starChannelId: this.starChannelId,
				starMessageId: this.starMessageId,
				stars: this.stars,
				userId: this.userId
			},
			where: {
				messageId_guildId_starMessageId: {
					guildId: this.guildId,
					messageId: this.messageId,
					starMessageId: this.starMessageId
				}
			}
		});
	}

	private async updateStarMessage(): Promise<void> {
		const [channelId, minimum] = await readSettings(this.#message.guild, [
			SettingsKeys.Modules.Starboard.ChannelId,
			SettingsKeys.Modules.Starboard.Minimum
		]);
		const t = await fetchT(this.#message);

		// If number of stars is 0 try to delete the starmessage and db entry.
		if (this.stars === 0 && this.#starMessage) {
			try {
				if (this.#starMessage.author.id !== envParseString(EnvKeys.ClientId)) return;
				// await this.#starMessage.delete();
				// await this.remove();
				return;
			} catch (error) {
				if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

				if (error.code === RESTJSONErrorCodes.MissingAccess) return;
				if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.edit({ enabled: false });
			}
		}

		// if number of reactions is less than the minimum or there is no channelId return;
		if (this.stars < minimum || isNullish(channelId)) return;

		// if existing starmessage try to update
		if (this.#starMessage) {
			try {
				const options = await this.getStarContent(t);
				await this.#starMessage.edit(options as MessageEditOptions);
			} catch (error) {
				if (!(error instanceof DiscordAPIError) || !(error instanceof HTTPError)) return;

				if (error.code === RESTJSONErrorCodes.MissingAccess) return;
				if (error.code === RESTJSONErrorCodes.UnknownMessage) await this.edit({ enabled: false });
			}

			return;
		}

		// if message author is bot then return;
		if (this.#message.author.bot) return;

		// fetch the starboard channel;
		const channel = cast<TextChannel | undefined>(this.#message.guild.channels.cache.get(channelId));
		if (!channel) return;

		this.id = await this.#fetchNextId();

		const options = await this.getStarContent(t);
		const promise = channel
			.send({ content: options.content ?? undefined, embeds: options.embeds! })
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
				// save to db if starboard sent successfully
				if (this.#starMessage) await this.save();
			});

		this.#manager.syncMessageMap.set(this, promise);
		await promise;
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

	public get starMessageURL() {
		if (!this.#starMessage) return null;
		return this.#starMessage.url;
	}
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

export async function getStarboard(guildId: string, messageId: string) {
	const { starboard } = container.prisma;
	const previous = await starboard.findFirst({ where: { guildId, messageId } });
	if (!previous) return null;

	const channel =
		container.client.channels.cache.get(previous.channelId!) || (await resolveToNull(container.client.channels.fetch(previous.channelId!)));
	if (!channel || !channel.isSendable()) return null;

	const message = channel.messages.cache.get(messageId) || (await resolveToNull(channel.messages.fetch(messageId)));
	if (!message || !message.inGuild()) return null;

	return previous ? new StarboardEntry(previous).init(getGuildStarboard(guildId), cast<GuildMessage>(message)) : null;
}

export function truncateStarboardEmojis(settings: readonly string[], fallback: string[] = defaultStarboardEmojis) {
	console.log(new Set([...fallback, ...settings]));
	return ['%E2%AD%90'];
}
