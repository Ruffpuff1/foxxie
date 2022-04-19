import type { GuildModerationManager } from '#lib/structures';
import { metadata, ModerationManagerDescriptionData, TypeMetadata, TypeCodes, MetaData, Title } from '#utils/moderation';
import type { Moderation } from '@prisma/client';
import type { O } from '@ruffpuff/ts';
import { Events } from '#lib/types';
import { cast, resolveToNull, Time, toTitleCase } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { Guild, GuildChannel, MessageEmbed, User } from 'discord.js';
import type { TFunction } from 'i18next';
import { LanguageKeys } from '#lib/i18n';
import { messageLink } from '#utils/transformers';
import { Schedules } from '#utils/constants';
import { fetchTasks } from '#utils/util';

export class ModerationModel {
    public caseId: number;

    public createdAt: Date;

    public extraData: O | null;

    public guildId: string;

    public moderatorId: string;

    public reason: string | null;

    public type: number;

    public channelId: string | null;

    public logChannelId: string | null;

    public logMessageId: string | null;

    public userId: string | null;

    public duration: number | null;

    public refrence: number | null;

    #manager: GuildModerationManager;

    #logChannel: GuildChannel;

    #channel: GuildChannel;

    #moderator: User;

    #user: User;

    public constructor(data?: Partial<Moderation>) {
        if (data) {
            for (const key of this.keys()) {
                // @ts-expect-error keys not allowed
                if (Reflect.has(data, key)) this[key] = data[key as keyof Moderation];
            }
            this.type = ModerationModel.getTypeFromDuration(this.type!, this.duration);
        }
    }

    public setup(manager: GuildModerationManager): this {
        this.#manager = manager;
        if (manager.guild) this.guildId = manager.guild.id;
        return this;
    }

    public clone(): ModerationModel {
        return new ModerationModel(this.data).setup(this.#manager);
    }

    public async create(): Promise<null | ModerationModel> {
        if (this.createdAt) return null;
        this.createdAt = new Date();

        if (!this.shouldSend) return null;

        this.caseId = (await this.#manager.getCurrentId()) + 1;
        this.#manager.insert(this);

        this.guild?.client.emit(Events.ModerationEntryAdd, this);
        return this;
    }

    public edit(data: ModerationManagerDescriptionData): ModerationModel {
        const dataWithType = {
            ...data,
            type: ModerationModel.getTypeFromDuration(this.type!, data.duration ?? this.duration!)
        };

        const clone = this.clone();

        try {
            Object.assign(this, dataWithType);
        } catch (e) {
            Object.assign(this, clone);
            throw e;
        }

        this.guild?.client.emit(Events.ModerationEntryEdit, clone, this);
        return this;
    }

    public setExtraData(value: O): this {
        this.extraData = value;
        return this;
    }

    public async fetchLogChannel(): Promise<GuildChannel | null> {
        if (this.#logChannel) return this.#logChannel;
        const channel: GuildChannel | null = this.logChannelId ? await resolveToNull(this.guild!.channels.fetch(this.logChannelId)) : null;

        if (channel) this.#logChannel = channel;
        return channel;
    }

    public async fetchChannel(): Promise<GuildChannel | null> {
        if (this.#channel) return this.#channel;
        const channel: GuildChannel | null = this.channelId ? await resolveToNull(this.guild!.channels.fetch(this.channelId)) : null;

        if (channel) this.#channel = channel;
        return channel;
    }

    public async prepareEmbed(): Promise<MessageEmbed> {
        const moderator = await this.fetchModerator();
        const { t, title } = await this.formatUtils();
        const description = await this.fetchDescription(moderator!, t);
        const caseT = toTitleCase(t(LanguageKeys.Globals.CaseT));

        return new MessageEmbed() //
            .setAuthor({
                name: title,
                iconURL: moderator?.displayAvatarURL({ dynamic: true })
            })
            .setColor(this.color)
            .setTimestamp(this.createdAt)
            .setDescription(description.join('\n'))
            .setFooter({
                text: `${caseT} #${t(LanguageKeys.Globals.NumberFormat, {
                    value: this.caseId
                })}`
            });
    }

    public async fetchDescription(moderator: User, t: TFunction): Promise<string[]> {
        const [user, channel, refrence] = await Promise.all([this.fetchUser(), this.fetchChannel(), this.fetchRefrence()]);
        const fillReason = t(LanguageKeys.Moderation.FillReason, {
            prefix: '/',
            count: this.caseId
        });

        return [
            user ? t(LanguageKeys.Guilds.Logs.ArgsUser, { user }) : null,
            moderator ? t(LanguageKeys.Guilds.Logs.ArgsModerator, { mod: moderator }) : null,
            channel ? t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel }) : null,
            this.duration
                ? t(LanguageKeys.Guilds.Logs.ArgsDuration, {
                      duration: Date.now() - Number(this.duration)
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
        ].filter(a => a !== null) as string[];
    }

    public async fetchModerator(): Promise<User | null> {
        if (this.#moderator) return this.#moderator;
        const moderator = this.moderatorId ? await resolveToNull(this.guild!.client.users.fetch(this.moderatorId)) : null;

        if (moderator) this.#moderator = moderator;
        return moderator;
    }

    public async fetchRefrence(): Promise<ModerationModel | null> {
        if (!this.refrence) return null;
        const entry = await this.#manager.fetch(this.refrence);
        if (!entry) return null;
        return entry as ModerationModel;
    }

    public async fetchTask() {
        const { guild } = this.#manager!;
        const tasks = await fetchTasks(this.appealTaskName!);
        return tasks.find(value => value.data && value.data.caseId === this.caseId && value.data.guildId === guild!.id) ?? null;
    }

    public async fetchUser(): Promise<null | User> {
        if (!this.userId) return null;

        if (Array.isArray(this.userId)) this.userId = this.userId[0];

        const previous = this.#user;
        if (previous?.id === this.userId) return previous;

        const user = await resolveToNull(this.guild!.client.users.fetch(this.userId!));
        if (user) this.#user = user;

        return user;
    }

    public async formatUtils(): Promise<FormatUtils> {
        const t = await container.prisma.guilds(this.guildId!, settings => settings.getLanguage());
        const { total } = this;

        return {
            title: total
                ? t(LanguageKeys.Moderation[this.metadata.title], {
                      count: total
                  })
                : t(LanguageKeys.Moderation[this.metadata.title], { count: 1 }),
            t
        };
    }

    public equals(other: ModerationModel): boolean {
        return (
            this.type === other.type &&
            this.duration === other.duration &&
            this.extraData === other.extraData &&
            this.reason === other.reason &&
            this.userId === other.userId &&
            this.moderatorId === other.moderatorId &&
            this.refrence === other.refrence &&
            this.channelId === other.channelId
        );
    }

    private keys(): (keyof ModerationModel)[] {
        return Object.keys(this) as (keyof ModerationModel)[];
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

    public get color(): number {
        return this.metadata.color;
    }

    public get createdTimestamp(): number {
        return this.createdAt!.getTime();
    }

    public get guild(): Guild | null {
        return this.#manager?.guild || container.client.guilds.cache.get(this.guildId!) || null;
    }

    public get title(): Title {
        return this.metadata.title;
    }

    private get data(): Partial<Moderation> {
        const keys = this.keys();
        return Object.fromEntries(keys.map(k => [k, this[k]]));
    }

    private get metadata(): MetaData {
        const data = metadata.get(this.type!);
        if (typeof data === 'undefined') throw new Error(`Inexistent metadata for '0b${this.type?.toString(2).padStart(8, '0')}'.`);
        return data;
    }

    private get shouldSend(): boolean {
        const before = Date.now() - Time.Minute;
        const { type } = this;

        const isBan = [TypeCodes.Ban, TypeCodes.UnBan, TypeCodes.SoftBan].includes(type!);
        const isMute = [TypeCodes.Mute, TypeCodes.TemporaryMute].includes(type!);

        for (const entry of this.#manager.values()) {
            if (this.userId !== entry.userId || before > entry.createdTimestamp) continue;

            if (type === entry.type) return false;
            if (isMute) return false;

            if (isBan && entry.type === TypeCodes.SoftBan) return false;
        }

        return true;
    }

    private get total(): null | number {
        const extraData = cast<{ total: number }>(this.extraData);

        if (!extraData?.total) return null;
        return extraData.total;
    }
}

interface FormatUtils {
    title: string;
    t: TFunction;
}
