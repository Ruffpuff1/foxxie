import type FoxxieClient from '#lib/FoxxieClient';
import { LanguageKeys } from '#lib/i18n';
import type { GuildModerationManager } from '#lib/structures';
import { FoxxieEvents } from '#lib/types';
import {
    MetaData,
    metadata,
    ModerationManagerDescriptionData,
    ModerationScheule,
    TypeMetadata,
    TypeVariationAppealNames
} from '#utils/moderation';
import { messageLink } from '#utils/transformers';
import type { TFunction } from '@foxxie/i18n';
import { cast, resolveToNull, Time, toTitleCase } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { EmbedBuilder, Guild, GuildChannel, User } from 'discord.js';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { GuildEntity, GuildSettings } from '..';

@Entity('moderation', { schema: 'public' })
export class ModerationEntity extends BaseEntity {
    #manager: GuildModerationManager | null = null;

    #moderator: User | null = null;

    #user: User | null = null;

    #total: number | null = null;

    #channel: GuildChannel | null = null;

    #logChannel: GuildChannel | null = null;

    @ObjectIdColumn()
    public _id!: string;

    @Column('integer')
    public caseId = -1;

    @Column('timestamp without time zone', { nullable: true, default: () => 'null' })
    public createdAt: Date | null = null;

    @Column('json', { nullable: true, default: () => 'null' })
    public extraData: ExtraData = null;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId: string | null = null;

    @Column('varchar', { length: 19, default: process.env.CLIENT_ID })
    public moderatorId: string = cast<string>(process.env.CLIENT_ID);

    @Column('varchar', { nullable: true, length: 2000, default: () => 'null' })
    public reason: string | null = null;

    @Column('smallint')
    public type?: number | null;

    @Column('smallint', { nullable: true, default: () => 'null' })
    public refrence: number | null;

    @Column('varchar', { nullable: true, default: () => 'null' })
    public channelId: string | null = null;

    @Column('varchar', { nullable: true, default: () => 'null' })
    public logChannelId: string | null = null;

    @Column('varchar', { nullable: true, default: () => 'null' })
    public logMessageId: string | null = null;

    @Column('varchar', { nullable: true, default: () => 'null' })
    public userId: string = null!;

    @Column('bigint', { nullable: true, default: () => 'null' })
    public duration: number | null = null;

    public constructor(data: Partial<ModerationEntity>) {
        super();

        if (data) {
            Object.assign(this, data);
            this.type = ModerationEntity.getTypeFromDuration(cast<number>(this.type), this.duration);
        }
    }

    public setup(manager: GuildModerationManager): ModerationEntity {
        this.#manager = manager;
        if (manager.guild) this.guildId = manager.guild.id;
        return this;
    }

    public clone(): ModerationEntity {
        return new ModerationEntity(this).setup(cast<GuildModerationManager>(this.#manager));
    }

    public equals(other: ModerationEntity): boolean {
        return (
            this.type === other.type &&
            this.duration === other.duration &&
            this.extraData === other.extraData &&
            this.reason === other.reason &&
            this.userId === other.userId &&
            this.moderatorId === other.moderatorId
        );
    }

    public resolveData(): Partial<ModerationEntity> {
        return {
            logChannelId: this.logChannelId,
            logMessageId: this.logMessageId,
            moderatorId: this.moderatorId ?? null,
            channelId: this.channelId ?? null,
            type: this.type,
            refrence: this.refrence,
            createdAt: this.createdAt,
            duration: this.duration ?? null,
            userId: this.userId ?? null,
            caseId: this.caseId,
            extraData: this.extraData ?? null,
            reason: this.reason ?? null
        };
    }

    public async create(): Promise<null | ModerationEntity> {
        // If the entry was created, there is no point on re-sending
        if (this.createdAt) return null;
        this.createdAt = new Date();

        const cases = await container.db.moderations.find({ where: { guildId: this.guildId! } });

        this.caseId = cases.length + 1;
        this.#manager?.insert(this);

        this.guild?.client.emit(FoxxieEvents.ModerationEntryAdd, this);
        return this;
    }

    public edit(data: ModerationManagerDescriptionData | Record<string, unknown> = {}): ModerationEntity {
        const dataWithType = {
            ...data,
            type: ModerationEntity.getTypeFromDuration(
                cast<number>(this.type),
                cast<ModerationManagerDescriptionData>(data).duration ?? this.duration
            )
        };
        const clone = this.clone();
        try {
            Object.assign(this, dataWithType);
        } catch (error) {
            Object.assign(this, clone);
            throw error;
        }

        this.client?.emit(FoxxieEvents.ModerationEntryEdit, clone, this);
        return this;
    }

    public async fetchModerator(): Promise<User | null> {
        if (this.#moderator) return this.#moderator;
        const moderator = this.moderatorId ? await resolveToNull(this.client.users.fetch(this.moderatorId)) : null;

        if (moderator) this.#moderator = moderator;
        return moderator;
    }

    public async prepareEmbed(): Promise<EmbedBuilder> {
        const moderator = await this.fetchModerator();
        const description = await this.fetchDescriptionData(cast<User>(moderator));
        const [title, t] = await this.formatUtils();
        const caseT = toTitleCase(t(LanguageKeys.Globals.CaseT));

        const embed = new EmbedBuilder()
            .setAuthor({ name: title, iconURL: moderator?.displayAvatarURL() })
            .setColor(this.color)
            .setTimestamp(this.createdTimestamp)
            .setDescription(description.join('\n'))
            .setFooter({ text: `${caseT} #${t(LanguageKeys.Globals.NumberFormat, { value: this.caseId })}` });

        return embed;
    }

    public async formatUtils(): Promise<[string, TFunction]> {
        const t = await container.db.guilds.acquire(this.guildId!, (settings: GuildEntity) => settings.getLanguage());

        const total = this.getTotal();
        if (total) return [t(LanguageKeys.Moderation[this.metadata.title], { count: total }), t];

        return [t(LanguageKeys.Moderation[this.metadata.title]), t];
    }

    public async fetchUser(): Promise<null | User> {
        if (!this.userId) return null;

        const previous = this.#user;
        if (previous?.id === this.userId) return previous;

        const user = await resolveToNull(this.client.users.fetch(this.userId));
        this.#user = user;
        return user;
    }

    public async fetchLogChannel(): Promise<GuildChannel | null> {
        if (this.#logChannel) return this.#logChannel;
        const channel = this.logChannelId
            ? cast<GuildChannel>(await resolveToNull(cast<Guild>(this.guild).channels.fetch(this.logChannelId)))
            : null;

        if (channel) this.#logChannel = channel;

        return channel;
    }

    public async fetchChannel(): Promise<GuildChannel | null> {
        if (this.#channel) return this.#channel;
        const channel = this.channelId
            ? cast<GuildChannel>(await resolveToNull(cast<Guild>(this.guild).channels.fetch(this.channelId)))
            : null;

        if (channel) this.#channel = channel;

        return channel;
    }

    public getTotal(): null | number {
        if (this.#total) return this.#total;
        if (!this.extraData?.total) return null;
        this.#total = this.extraData?.total ?? null;
        return this.#total;
    }

    public static getTypeFromDuration(type: number, duration: number | null): number {
        if (duration === null) return type;
        if (duration < Time.Minute) return type | TypeMetadata.Temporary | TypeMetadata.Fast;
        return type | TypeMetadata.Temporary;
    }

    private async fetchDescriptionData(_moderator: User): Promise<string[]> {
        const [prefix, t] = await container.db.guilds.acquire(this.guildId!, settings => [
            settings[GuildSettings.Prefix],
            settings.getLanguage()
        ]);

        const [_users, _channel] = await Promise.all([this.fetchUser(), this.fetchChannel()]);
        const fillReason = t(LanguageKeys.Moderation.FillReason, { prefix, count: this.caseId });

        const refrence = this.refrence ? await this.fetchRefrenceCase(this.refrence) : null;

        return cast<string[]>(
            [
                _users ? t(LanguageKeys.Guilds.Logs.ArgsUser, { user: _users }) : null,
                _channel ? t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel: _channel }) : null,
                _moderator ? t(LanguageKeys.Guilds.Logs.ArgsModerator, { mod: _moderator }) : null,
                t(LanguageKeys.Guilds.Logs.ArgsReason, { reason: this.reason ?? fillReason }),
                refrence
                    ? t(LanguageKeys.Guilds.Logs.ArgsRefrence, {
                          id: this.refrence,
                          url: messageLink(this.guildId!, refrence.logChannelId!, refrence.logMessageId!)
                      })
                    : null,
                this.duration
                    ? t(LanguageKeys.Guilds.Logs.ArgsDuration, { duration: this.createdTimestamp + this.duration })
                    : null
            ].filter(a => Boolean(a))
        );
    }

    private async fetchRefrenceCase(caseId: number) {
        const fetched = await this.#manager?.fetch(caseId);
        if (fetched) return fetched;
        return null;
    }

    public get guild(): Guild | null | undefined {
        return this.#manager?.guild;
    }

    public get client(): FoxxieClient {
        return cast<FoxxieClient>(container.client);
    }

    public get metadata(): MetaData {
        const data = metadata.get(cast<number>(this.type));
        if (typeof data === 'undefined')
            throw new Error(`Inexistent metadata for '0b${this.type?.toString(2).padStart(8, '0')}'.`);
        return data;
    }

    public get title(): string {
        return this.metadata.title;
    }

    public get color(): number {
        return this.metadata.color;
    }

    public get createdTimestamp(): number {
        return this.createdAt?.getTime() ?? Date.now();
    }

    public get appealTaskName(): ModerationScheule | null {
        if (!this.duration) return null;
        switch (this.title) {
            case 'TempMute':
                return TypeVariationAppealNames.Mute;
            case 'TempBan':
                return TypeVariationAppealNames.Ban;
            case 'TempNickname':
                return TypeVariationAppealNames.Nickname;
            default:
                return null;
        }
    }
}

type ExtraData = null | {
    total?: number;
};
