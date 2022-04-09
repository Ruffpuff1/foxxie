import { messageLink } from '#utils/transformers';
import type { Title } from '#utils/moderation';
import { Schedules } from '#utils/constants';
import { Events } from '#lib/types';
import { metadata, TypeMetadata, TypeBits, ModerationManagerDescriptionData, TypeCodes, MetaData } from '#utils/moderation';
import { LanguageKeys } from '#lib/i18n';
import { BaseEntity, Column, Entity, PrimaryColumn, ObjectIdColumn } from 'typeorm';
import { acquireSettings } from '../functions';
import { User, GuildChannel, Guild, MessageEmbed } from 'discord.js';
import type { GuildModerationManager } from '#lib/structures';
import type { TFunction } from 'i18next';
import type FoxxieClient from '#lib/FoxxieClient';
import { GuildSettings, kBigIntTransformer } from '#lib/database';
import { container } from '@sapphire/framework';
import { toTitleCase, resolveToNull, Time } from '@ruffpuff/utilities';
import type { NonNullObject } from '@sapphire/utilities';
import { fetchTasks, MappedJob } from '#utils/util';

export interface ModerationLanguageKeys {
    [key: string]: string;
}

@Entity('moderation', { schema: 'public' })
export class ModerationEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @Column('integer')
    public caseId = -1;

    @Column('timestamp without time zone', {
        nullable: true,
        default: () => 'null'
    })
    public createdAt: Date | null = null;

    @Column('json', { nullable: true, default: () => 'null' })
    public extraData: NonNullObject | null = null;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId: string | null = null;

    @Column('varchar', { length: 19, default: process.env.CLIENT_ID })
    public moderatorId: string = process.env.CLIENT_ID as string;

    @Column('varchar', { nullable: true, length: 2000, default: () => 'null' })
    public reason: string | null = null;

    @Column('smallint')
    public type?: number | null;

    @Column('varchar', { nullable: true, default: () => 'null' })
    public channelId: string | null = null;

    @Column('varchar', { nullable: true, default: () => 'null' })
    public logChannelId: string | null = null;

    @Column('varchar', { nullable: true, default: () => 'null' })
    public logMessageId: string | null = null;

    @Column('varchar', { nullable: true, default: () => 'null' })
    public userId: string | null = null;

    @Column('bigint', {
        nullable: true,
        default: () => 'null',
        transformer: kBigIntTransformer
    })
    public duration: number | null = null;

    @Column('integer', { nullable: true, default: () => 'null' })
    public refrence: number | null = null;

    #manager: GuildModerationManager | null = null;

    #moderator: User | null = null;

    #user: User | null = null;

    #total: number | null = null;

    #channel: GuildChannel | null = null;

    #logChannel: GuildChannel | null = null;

    public constructor(data: Partial<ModerationEntity>) {
        super();

        if (data) {
            Object.assign(this, data);
            this.type = ModerationEntity.getTypeFromDuration(this.type as number, this.duration);
        }
    }

    public setup(manager: GuildModerationManager): ModerationEntity {
        this.#manager = manager;
        if (manager.guild) this.guildId = manager.guild.id;
        return this;
    }

    public clone(): ModerationEntity {
        return new ModerationEntity(this).setup(this.#manager as GuildModerationManager);
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

    public async fetchTask() {
        const { guild } = this.#manager!;
        const tasks = await fetchTasks(this.appealTaskName!);
        return tasks.find(value => value.data && value.data.caseId === this.caseId && value.data.guildId === guild!.id) ?? null;
    }

    public async create(): Promise<null | ModerationEntity> {
        // If the entry was created, there is no point on re-sending
        if (this.createdAt) return null;
        this.createdAt = new Date();

        if (!this.shouldSend) return null;

        this.caseId = await this.#manager!.getCurrentId() + 1;
        this.#manager!.insert(this);

        this.guild?.client.emit(Events.ModerationEntryAdd, this);
        return this;
    }

    public edit(data: ModerationManagerDescriptionData | Record<string, unknown> = {}): ModerationEntity {
        const dataWithType = {
            ...data,
            type: ModerationEntity.getTypeFromDuration(this.type!, (data as ModerationManagerDescriptionData).duration ?? this.duration)
        };
        const clone = this.clone();
        try {
            Object.assign(this, dataWithType);
        } catch (error) {
            Object.assign(this, clone);
            throw error;
        }

        this.client?.emit(Events.ModerationEntryEdit, clone, this);
        return this;
    }

    public setExtraData(value: NonNullObject): ModerationEntity {
        this.extraData = value;
        return this;
    }

    public async fetchLogChannel(): Promise<GuildChannel | null> {
        if (this.#logChannel) return this.#logChannel;
        const channel = this.logChannelId ? ((await resolveToNull(this.guild!.channels.fetch(this.logChannelId))) as GuildChannel) : null;

        if (channel) this.#logChannel = channel;

        return channel;
    }

    public async fetchChannel(): Promise<GuildChannel | null> {
        if (this.#channel) return this.#channel;
        const channel = this.channelId ? ((await resolveToNull(this.guild!.channels.fetch(this.channelId))) as GuildChannel) : null;

        if (channel) this.#channel = channel;

        return channel;
    }

    public async prepareEmbed(): Promise<MessageEmbed> {
        const moderator = await this.fetchModerator();
        const description = await this.fetchDescriptionData(moderator!);
        const formats = await this.formats();
        const caseT = toTitleCase(formats.t(LanguageKeys.Globals.CaseT));

        const embed = new MessageEmbed()
            .setAuthor({
                name: formats.title,
                iconURL: moderator?.displayAvatarURL({ dynamic: true })
            })
            .setColor(this.color)
            .setTimestamp(this.createdTimestamp)
            .setDescription(description.join('\n'))
            .setFooter({
                text: `${caseT} #${formats.t(LanguageKeys.Globals.NumberFormat, {
                    value: this.caseId
                })}`
            });

        return embed;
    }

    public async fetchModerator(): Promise<User | null> {
        if (this.#moderator) return this.#moderator;
        const moderator = this.moderatorId ? await resolveToNull(this.client.users.fetch(this.moderatorId)) : null;

        if (moderator) this.#moderator = moderator;
        return moderator;
    }

    public async formats(): Promise<{ title: string; t: TFunction }> {
        const t = await acquireSettings(this.guildId!, settings => settings.getLanguage());
        const total = this.getTotal();

        return {
            title: total
                ? t(LanguageKeys.Moderation[this.metadata.title], {
                      count: total
                  })
                : t(LanguageKeys.Moderation[this.metadata.title], { count: 1 }),
            t
        };
    }

    public async fetchUser(): Promise<null | User> {
        if (!this.userId) return null;
        // eslint-disable-next-line prefer-destructuring
        if (Array.isArray(this.userId)) this.userId = this.userId[0];

        const previous = this.#user;
        if (previous?.id === this.userId) return previous;

        const user = await resolveToNull(this.client.users.fetch(this.userId!));
        this.#user = user;
        return user;
    }

    private async fetchDescriptionData(mod: User): Promise<(string | null)[]> {
        const [prefix, t] = await acquireSettings(this.guildId!, settings => [settings[GuildSettings.Prefix], settings.getLanguage()]);

        const [user, channel, refrence] = await Promise.all([this.fetchUser(), this.fetchChannel(), this.fetchRefrenceCase()]);
        const fillReason = t(LanguageKeys.Moderation.FillReason, {
            prefix,
            count: this.caseId
        });

        return [
            user ? t(LanguageKeys.Guilds.Logs.ArgsUser, { user }) : null,
            mod ? t(LanguageKeys.Guilds.Logs.ArgsModerator, { mod }) : null,
            channel ? t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel }) : null,
            this.duration
                ? t(LanguageKeys.Guilds.Logs.ArgsDuration, {
                      duration: Date.now() - this.duration
                  })
                : null,
            t(LanguageKeys.Guilds.Logs.ArgsReason, {
                reason: this.reason ?? fillReason
            }),
            refrence
                ? t(LanguageKeys.Guilds.Logs.ArgsRefrence, {
                      id: refrence.caseId,
                      url: messageLink(this.guildId!, refrence.logChannelId!, refrence.logMessageId!)
                  })
                : null
        ].filter(a => a !== null);
    }

    private async fetchRefrenceCase(): Promise<ModerationEntity | null> {
        if (!this.refrence) return null;
        const entry = await this.#manager!.fetch(this.refrence);
        if (!entry) return null;
        return entry as ModerationEntity;
    }

    private getTotal(): null | number {
        if (this.#total) return this.#total;
        const extra = this.extraData as { total: number };

        if (!extra?.total) return null;
        this.#total = extra?.total ?? null;
        return this.#total;
    }

    private static getTypeFromDuration(type: number, duration: number | null): number {
        if (duration === null) return type;
        if (duration < Time.Minute) return type | TypeMetadata.Temporary | TypeMetadata.Fast;
        return type | TypeMetadata.Temporary;
    }

    public get appealTaskName(): Schedules.EndTempBan | Schedules.EndTempMute | Schedules.EndTempNick | Schedules.EndTempRestrictEmbed | null {
        if (!this.duration) return null;
        switch (this.title) {
            case 'TempMute':
                return Schedules.EndTempMute;
            case 'TempBan':
                return Schedules.EndTempBan;
            case 'TempNickname':
                return Schedules.EndTempNick;
            case 'TempRestrictEmbed':
                return Schedules.EndTempRestrictEmbed;
            default:
                return null;
        }
    }

    public get typeVariation(): number {
        return this.type! & TypeBits.Variation;
    }

    public get guild(): Guild | null {
        return this.#manager?.guild || container.client.guilds.cache.get(this.guildId!) || null;
    }

    public get title(): Title {
        return this.metadata.title;
    }

    public get color(): number {
        return this.metadata.color;
    }

    public get createdTimestamp(): number {
        return this.createdAt?.getTime() ?? Date.now();
    }

    public get client(): FoxxieClient {
        return container.client as FoxxieClient;
    }

    private get metadata(): MetaData {
        const data = metadata.get(this.type!);
        if (typeof data === 'undefined') throw new Error(`Inexistent metadata for '0b${this.type?.toString(2).padStart(8, '0')}'.`);
        return data;
    }

    private get shouldSend(): boolean {
        const before = Date.now() - Time.Minute;
        const { type } = this;
        const isBan = type === 0 || type === 100 || type === 4;
        const isMute = type === TypeCodes.Mute || type === TypeCodes.TemporaryMute;

        for (const entry of this.#manager!.values()) {
            if (this.userId !== entry.userId || before > entry.createdTimestamp) continue;

            if (type === entry.type) return false;
            if (isMute && (entry.type === TypeCodes.TemporaryMute || entry.type === TypeCodes.Mute)) return false;

            if (isBan && entry.type === TypeCodes.SoftBan) return false;
        }

        return true;
    }
}

export interface ModerationTaskData<T = unknown> {
    caseId: number;
    userId: string;
    guildId: string;
    duration: number;
    channelId: string;
    moderatorId: string;
    extra: T;
    scheduleRetryCount?: number;
}

export type ModerationTask =
    | MappedJob<Schedules.EndTempBan>
    | MappedJob<Schedules.EndTempMute>
    | MappedJob<Schedules.EndTempNick>
    | MappedJob<Schedules.EndTempRestrictEmbed>;
