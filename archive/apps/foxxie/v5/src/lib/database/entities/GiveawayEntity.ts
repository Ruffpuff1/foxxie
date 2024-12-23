import { container } from '@sapphire/framework';
import { APIEmbed, APIMessage, RESTJSONErrorCodes, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v9';
import { DiscordAPIError, Guild, GuildMember, MessageEmbed, Snowflake } from 'discord.js';
import { BrandingColors } from '#utils/constants';
import { fetchReactionUsers } from '#utils/util';
import { messageLink, formatInitialGiveawayEmbed } from '#utils/transformers';
import { resolveToNull } from '@ruffpuff/utilities';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { acquireSettings, writeSettings } from '../functions';
import { TwemojiRegex } from '@sapphire/discord.js-utilities';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import { time, TimestampStyles } from '@discordjs/builders';
import { api } from '#external/Api';

@Entity('giveaway', { schema: 'public' })
export class GiveawayEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn('varchar', { length: 256 })
    public title!: string;

    @Column('timestamp without time zone')
    public startedAt = new Date();

    @Column('timestamp without time zone')
    public endsAt!: Date;

    @Column('varchar', { length: 19 })
    public guildId: Snowflake;

    @Column('varchar', { length: 19 })
    public channelId: Snowflake;

    @PrimaryColumn('varchar', { length: 19 })
    public messageId: Snowflake | null = null;

    @Column('varchar', { length: 19 })
    public authorId: Snowflake | null = null;

    @Column('integer', { default: 1 })
    public minimum = 1;

    @Column('integer', { default: 1 })
    public minimumWinners = 1;

    @Column('varchar', { length: 19 })
    public requiredRole: string | null = null;

    @Column('varchar')
    public emoji: string = null!;

    #createdByBot = false;

    #t: TFunction = null!;

    public constructor(data: Partial<GiveawayEntity> = {}) {
        super();
        Object.assign(this, data);
    }

    public async fetchAuthor(): Promise<GuildMember | null> {
        if (!this.authorId) return null;

        const { guild } = this;
        if (!guild) return null;

        return resolveToNull(guild.members.fetch(this.authorId));
    }

    public async post() {
        const t = await fetchT(this.guild!);
        this.#t = t;

        const channel = await resolveToNull(this.guild!.channels.fetch(this.channelId));
        if (!channel) return null;

        if (!this.emoji) {
            const rawEmoji = await acquireSettings(this.guild!, 'giveawayEmoji');
            this.emoji = rawEmoji.includes('%') ? rawEmoji : encodeURIComponent(rawEmoji.replace(/[<>]/g, ''));
        }

        if (!this.messageId) {
            this.#createdByBot = true;

            const decodedEmoji = decodeURIComponent(this.emoji);
            const formattedEmoji = TwemojiRegex.test(decodedEmoji) ? decodedEmoji : `<${decodedEmoji}>`;

            const author = await this.fetchAuthor();
            const embed = formatInitialGiveawayEmbed(this.guild!, author!, formattedEmoji, this.#t, {
                requiredRole: this.requiredRole,
                endsAt: this.endsAt,
                minimumWinners: this.minimumWinners,
                title: this.title,
                authorId: this.authorId!,
                startedAt: this.startedAt
            });

            const message = await api()
                .channels(this.channelId)
                .messages.post({ data: { embeds: [embed.toJSON() as APIEmbed] } });

            this.messageId = message.id;
        }

        try {
            await api().channels(this.channelId).messages(this.messageId).reactions(this.emoji, '@me').put();
        } catch (error) {
            if (!(error instanceof DiscordAPIError)) throw error;

            if (error.code !== RESTJSONErrorCodes.UnknownEmoji) throw error;

            const defaultEmoji = encodeURIComponent('🎉');

            await api().channels(this.channelId).messages(this.messageId).reactions(defaultEmoji, '@me').put();
            this.emoji = defaultEmoji;
            await writeSettings(this.guild!, settings => (settings.giveawayEmoji = defaultEmoji));
        }

        return this.save();
    }

    public async end() {
        const winners = await this.fetchWinners();

        let sent: APIMessage;

        if (winners === null || !winners.length) sent = await this.endWithNoWinner();
        else sent = await this.endWithWinner(winners);

        if (await acquireSettings(this.guild!, 'giveawayRemoveReactions')) {
            try {
                await api().channels(this.channelId).messages(this.messageId!).reactions(this.emoji).delete();
            } catch (error) {
                // noop
            }
        }

        const author = await this.fetchAuthor();

        let embed: MessageEmbed | null = null;

        if (this.#createdByBot) {
            const description: string[] = [];

            description.push(
                this.#t('listeners/events:giveawayEmbedEnded', {
                    time: time(Math.round(this.endsAt?.getTime() / 1000), TimestampStyles.RelativeTime)
                }),
                `> [${this.#t('listeners/events:starboardJumpTo')}](${messageLink(this.guildId, this.channelId, sent.id)})`
            );

            embed = new MessageEmbed()
                .setColor(this.guild?.me?.displayColor || BrandingColors.Primary)
                .setAuthor({
                    name: author!.user.tag,
                    iconURL: author?.displayAvatarURL({ dynamic: true })
                })
                .setTitle(this.title)
                .setTimestamp(this.startedAt)
                .setDescription(description.join('\n'));

            try {
                await api()
                    .channels(this.channelId)
                    .messages(this.messageId!)
                    .patch({ data: { embeds: [embed] } });
            } catch {
                // noop;
            }
        }

        await this.dispose();
        container.client.emit('giveawayEnd', winners ?? [], embed, this.guild);
    }

    public async fetchWinners() {
        const participants = await this.filter([...(await fetchReactionUsers(this.channelId, this.messageId!, this.emoji))]);

        if (participants.length < this.minimum) return null;

        let m = participants.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [participants[m], participants[i]] = [participants[i], participants[m]];
        }
        return participants.slice(0, this.minimumWinners);
    }

    public async filter(users: string[]) {
        if (users.length < this.minimum) return [];

        const { guild } = this;

        if (guild === null) return [];

        if (guild.members.cache.size !== guild.memberCount) await guild.members.fetch().catch(() => ({}));
        const filtered: string[] = [];

        for (const user of users) {
            if (user === this.authorId) continue;
            const member = guild.members.cache.get(user);

            if (member === undefined) continue;
            if (this.requiredRole && !member.roles.cache.has(this.requiredRole)) continue;

            filtered.push(user);
        }

        return filtered;
    }

    private async dispose() {
        await this.remove();
        return this;
    }

    private async endWithWinner(winners: string[]) {
        const mapped = winners.map(id => this.guild!.members.cache.get(id) ?? null).filter(a => Boolean(a));
        if (!mapped.length) return this.endWithNoWinner();

        const author = await this.fetchAuthor();

        const [shouldReply, shouldPing] = await acquireSettings(this.guild!, ['giveawayReplyToMessage', 'giveawayMentionWinners']);

        const description: string[] = [];

        if (!shouldReply) description.push(this.link);
        description.push(
            this.#t('listeners/events:giveawayWinnersHeader', {
                count: mapped.length
            })
        );

        for (const member of mapped) {
            description.push(`> ${member!.toString()}`);
        }

        const embed = new MessageEmbed()
            .setColor(this.guild?.me?.displayColor || BrandingColors.Primary)
            .setAuthor({
                name: author!.user.tag,
                iconURL: author?.displayAvatarURL({ dynamic: true })
            })
            .setTitle(this.title)
            .setTimestamp()
            .setDescription(description.join('\n'));

        const data = {
            message_reference: shouldReply ? { message_id: this.messageId } : null,
            embeds: [embed.toJSON()]
        } as RESTPostAPIChannelMessageJSONBody;

        if (shouldPing) data.content = mapped.map(member => member!.toString()).join(', ');

        const message = await api().channels(this.channelId).messages.post({ data });

        return message;
    }

    private async endWithNoWinner() {
        const author = await this.fetchAuthor();

        const shouldReply = await acquireSettings(this.guild!, 'giveawayReplyToMessage');

        const description: string[] = [];

        if (!shouldReply) description.push(this.link);
        description.push(this.#t('listeners/events:giveawayNoResults'));

        const embed = new MessageEmbed()
            .setColor(this.guild?.me?.displayColor || BrandingColors.Primary)
            .setAuthor({
                name: author!.user.tag,
                iconURL: author?.displayAvatarURL({ dynamic: true })
            })
            .setTitle(this.title)
            .setTimestamp()
            .setDescription(description.join('\n'));

        const data = {
            message_reference: shouldReply ? { message_id: this.messageId! } : undefined,
            embeds: [embed.toJSON() as APIEmbed]
        };

        const message = await api().channels(this.channelId).messages.post({ data });

        return message;
    }

    public get guild(): Guild | null {
        return container.client.guilds.cache.get(this.guildId) ?? null;
    }

    public get link(): string {
        return `[${this.#t('listeners/events:starboardJumpTo')}](${messageLink(this.guildId, this.channelId, this.messageId!)})\n`;
    }
}
