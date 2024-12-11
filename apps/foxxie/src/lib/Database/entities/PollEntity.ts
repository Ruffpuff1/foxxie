import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { fetchT } from '@sapphire/plugin-i18next';
import { cast } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { GuildPollService } from '#lib/Container/Utility/Guild/GuildPollService';
import { EnvKeys, GuildMessage } from '#lib/types';
import { BrandingColors, Colors } from '#utils/constants';
import { fetchReactionUsers, floatPromise } from '#utils/util';
import { EmbedBuilder, GuildMember, inlineCode, Routes, TextBasedChannel, time, TimestampStyles } from 'discord.js';
import { TFunction } from 'i18next';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('poll', { schema: 'public' })
export class PollEntity extends BaseEntity {
	@ObjectIdColumn()
	public _id!: string;

	@Column('varchar', { length: 19 })
	public channelId: string = null!;

	@Column('boolean')
	public enabled = true;

	@Column('bigint')
	public endsAt: null | number = null;

	@PrimaryColumn('varchar', { length: 19 })
	public guildId: string = null!;

	@Column('boolean')
	public hasEmojis = false;

	@Column('timestamp')
	public lastUpdated = new Date();

	@PrimaryColumn('varchar', { length: 19 })
	public messageId: string = null!;

	@Column('jsonb')
	public options: PollOption[] = [];

	@Column('integer')
	public pollId = -1;

	@Column('varchar')
	public title: string = null!;

	@Column('varchar', { length: 19 })
	public userId: string = null!;

	#member: GuildMember | null = null;

	#message!: GuildMessage;

	#service: GuildPollService | null = null;

	public constructor(data: Partial<PollEntity>) {
		super();

		if (data) {
			Object.assign(this, data);
		}
	}

	public async edit() {
		await this.updateMessage();
	}

	public async fetchMessage() {
		const channel = (await resolveToNull(container.client.channels.fetch(this.channelId))) as null | TextBasedChannel;
		if (!channel) return null;

		try {
			const message = cast<GuildMessage>(await channel.messages.fetch(this.messageId));
			this.#message = message;
		} catch (err) {
			console.error(err);
			return null;
		}

		return this.#message;
	}

	public async fetchReactionsForOptions() {
		const results = await Promise.all(
			this.options.map(async (option) => {
				const reactionSet = await fetchReactionUsers(this.channelId, this.messageId, [encodeURIComponent(option.emoji)]);
				const users = [...reactionSet].filter((id) => id !== envParseString(EnvKeys.ClientId));

				return { count: users.length, option: { ...option, count: users.length }, users };
			})
		);

		return results;
	}

	public async getEmbed(t: TFunction) {
		const color = await this.color();

		return new EmbedBuilder()
			.setAuthor({
				iconURL: this.#member?.avatarURL() || this.#member?.user.avatarURL() || undefined,
				name: this.title
			})
			.setColor(color)
			.setDescription(this.getContent(t))
			.setFooter({ text: `Poll #${this.pollId}` })
			.setTimestamp(this.lastUpdated);
	}

	public getEndContent() {
		if (!this.endsAt) return null;

		const date = new Date(this.endsAt);
		const timestamp = time(date, TimestampStyles.RelativeTime);

		return this.ended ? `This poll has ended. (${timestamp})` : `This poll will end ${timestamp}.`;
	}

	public async reactEmojis() {
		if (this.hasEmojis) return;

		try {
			for (const option of this.options) {
				await this.#message.react(option.emoji);
			}

			this.hasEmojis = true;

			await this.save();
		} catch (err) {
			console.error(err);
		}
	}

	public async removeReactions(userId: string, emoji: string) {
		if (!this.#message) return;

		await Promise.all(
			this.#message.reactions.cache
				.filter((reaction) => encodeURIComponent(reaction.emoji.name!) !== emoji)
				.map((reaction) =>
					floatPromise(
						reaction.client.rest.delete(
							Routes.channelMessageUserReaction(this.channelId, this.messageId, encodeURIComponent(reaction.emoji.name!), userId)
						)
					)
				)
		);
	}

	public override save() {
		return container.db.polls.save(this);
	}

	public setup(service: GuildPollService): PollEntity {
		this.#service = service;
		if (service.guild) this.guildId = service.guild.id;
		return this;
	}

	public async updateMessage() {
		const message = await this.fetchMessage();
		if (!message) return;

		if (!this.enabled && !this.ended) this.enabled = true;

		if (this.enabled) await this.updatePollOptionData();

		try {
			const t = await fetchT(container.client.guilds.cache.get(this.guildId)!);
			const embed = await this.getEmbed(t);

			const endingContent = this.getEndContent();

			await message.edit({ content: endingContent, embeds: [embed] });
		} catch (err) {
			console.error(err);
		}

		if (!this.enabled) return;

		if (this.ended) {
			this.enabled = false;

			await floatPromise(this.#message.reactions.removeAll());
			await this.save();

			return;
		}

		if (!this.hasEmojis) await this.reactEmojis();
	}

	public async updatePollOptionData() {
		const userResults = await this.fetchReactionsForOptions();
		this.options = userResults.map((result) => result.option);

		await this.save();
	}

	private async color() {
		const guild = this.#service?.guild;
		if (!guild) return Colors.TheCornerStoreStarboard;
		const member = await resolveToNull(guild.members.fetch(this.userId));
		if (!member) return BrandingColors.Secondary;

		this.#member = member;

		return member.displayColor || BrandingColors.Secondary;
	}

	private getContent(_t: TFunction) {
		return this.options
			.sort((a, b) => a.optionNumber - b.optionNumber)
			.map((option) => {
				const isZero = option.count === 0;
				const percent = isZero ? 0 : this.getPercent(option.count);
				return [`${option.emoji}`, isZero ? null : inlineCode(`${option.count} votes (${percent}%)`), `- ${option.name}`]
					.filter((a) => Boolean(a))
					.join(' ');
			})
			.join('\n');
	}

	private getPercent(count: number) {
		return Math.round((count / this.voteTotal) * 100);
	}

	public get ended() {
		if (!this.endsAt) return false;
		const date = new Date(this.endsAt);

		const future = date.getTime() > Date.now();

		return !future;
	}

	private get voteTotal() {
		return this.options.reduce((acc, res) => (acc += res.count), 0);
	}
}

export interface PollOption {
	count: number;
	emoji: string;
	name: string;
	optionNumber: number;
}
