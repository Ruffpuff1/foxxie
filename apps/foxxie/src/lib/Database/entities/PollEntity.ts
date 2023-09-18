import { GuildPollService } from '#lib/Container/Utility/Guild/GuildPollService';
import { EnvKeys, GuildMessage } from '#lib/Types';
import { BrandingColors, Colors } from '#utils/constants';
import { fetchReactionUsers, floatPromise } from '#utils/util';
import { EnvParse } from '@foxxie/env';
import { TFunction } from '@foxxie/i18n';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { cast } from '@sapphire/utilities';
import { EmbedBuilder, GuildMember, Routes, TextBasedChannel, TimestampStyles, inlineCode, time } from 'discord.js';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('poll', { schema: 'public' })
export class PollEntity extends BaseEntity {
    #service: GuildPollService | null = null;

    #message: GuildMessage;

    #member: GuildMember | null = null;

    @ObjectIdColumn()
    public _id!: string;

    @Column('integer')
    public pollId = -1;

    @Column('boolean')
    public enabled = true;

    @Column('boolean')
    public hasEmojis = false;

    @Column('varchar', { length: 19 })
    public userId: string = null!;

    @PrimaryColumn('varchar', { length: 19 })
    public messageId: string = null!;

    @Column('varchar', { length: 19 })
    public channelId: string = null!;

    @Column('varchar')
    public title: string = null!;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId: string = null!;

    @Column('jsonb')
    public options: PollOption[] = [];

    @Column('bigint')
    public endsAt: number | null = null;

    @Column('timestamp')
    public lastUpdated = new Date();

    public constructor(data: Partial<PollEntity>) {
        super();

        if (data) {
            Object.assign(this, data);
        }
    }

    public setup(service: GuildPollService): PollEntity {
        this.#service = service;
        if (service.guild) this.guildId = service.guild.id;
        return this;
    }

    public async fetchMessage() {
        const channel = (await resolveToNull(container.client.channels.fetch(this.channelId))) as TextBasedChannel | null;
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

    public async edit() {
        await this.updateMessage();
    }

    public async updateMessage() {
        const message = await this.fetchMessage();
        if (!message) return;

        if (!this.enabled && !this.ended) this.enabled = true;

        if (this.enabled) await this.updatePollOptionData();

        try {
            const t = await container.utilities.guild(this.guildId).settings.getT();
            const embed = await this.getEmbed(t);

            const endingContent = this.getEndContent();

            await message.edit({ embeds: [embed], content: endingContent });
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

    public getEndContent() {
        if (!this.endsAt) return null;

        const date = new Date(this.endsAt);
        const timestamp = time(date, TimestampStyles.RelativeTime);

        return this.ended ? `This poll has ended. (${timestamp})` : `This poll will end ${timestamp}.`;
    }

    public async updatePollOptionData() {
        const userResults = await this.fetchReactionsForOptions();
        this.options = userResults.map(result => result.option);

        await this.save();
    }

    public async fetchReactionsForOptions() {
        const results = await Promise.all(
            this.options.map(async option => {
                const reactionSet = await fetchReactionUsers(this.channelId, this.messageId, [encodeURIComponent(option.emoji)]);
                const users = [...reactionSet].filter(id => id !== EnvParse.string(EnvKeys.ClientId));

                return { users, count: users.length, option: { ...option, count: users.length } };
            })
        );

        return results;
    }

    public async removeReactions(userId: string, emoji: string) {
        if (!this.#message) return;

        await Promise.all(
            this.#message.reactions.cache
                .filter(reaction => encodeURIComponent(reaction.emoji.name!) !== emoji)
                .map(reaction =>
                    floatPromise(
                        reaction.client.rest.delete(
                            Routes.channelMessageUserReaction(
                                this.channelId,
                                this.messageId,
                                encodeURIComponent(reaction.emoji.name!),
                                userId
                            )
                        )
                    )
                )
        );
    }

    public async getEmbed(t: TFunction) {
        const color = await this.color();

        return new EmbedBuilder()
            .setAuthor({
                name: this.title,
                iconURL: this.#member?.avatarURL() || this.#member?.user.avatarURL() || undefined
            })
            .setColor(color)
            .setDescription(this.getContent(t))
            .setFooter({ text: `Poll #${this.pollId}` })
            .setTimestamp(this.lastUpdated);
    }

    public save() {
        return container.db.polls.save(this);
    }

    private getContent(_t: TFunction) {
        return this.options
            .sort((a, b) => a.optionNumber - b.optionNumber)
            .map(option => {
                const isZero = option.count === 0;
                const percent = isZero ? 0 : this.getPercent(option.count);
                return [`${option.emoji}`, isZero ? null : inlineCode(`${option.count} votes (${percent}%)`), `- ${option.name}`]
                    .filter(a => Boolean(a))
                    .join(' ');
            })
            .join('\n');
    }

    private getPercent(count: number) {
        return Math.round((count / this.voteTotal) * 100);
    }

    private async color() {
        const guild = this.#service?.guild;
        if (!guild) return Colors.TheCornerStoreStarboard;
        const member = await resolveToNull(guild.members.fetch(this.userId));
        if (!member) return BrandingColors.Secondary;

        this.#member = member;

        return member.displayColor || BrandingColors.Secondary;
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
    emoji: string;
    count: number;
    name: string;
    optionNumber: number;
}
