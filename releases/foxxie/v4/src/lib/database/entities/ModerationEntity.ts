/**
 * Copyright 2019-2021 Antonio Román
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * This version has been changed by <@Ruffpuff1> to support more log arguments, and be compatible with our MongoDB driver.
 */
import { getHaste, resolveToNull, events, time, Urls } from '../../util';
import { metadata, TypeMetadata, TypeVariationAppealNames, TypeBits, ModerationTypeAssets, ModerationManagerDescriptionData } from '../../util/moderationConstants';
import { FoxxieEmbed } from '../../discord';
import { languageKeys } from '../../i18n';
import { BaseEntity, Column, Entity, PrimaryColumn, ValueTransformer, ObjectIdColumn } from 'typeorm';
import { aquireSettings } from '../util';
import type { User, GuildChannel, Guild } from 'discord.js';
import type { GuildModerationManager } from '../../moderation';
import { isNullish } from '@sapphire/utilities';
import type { GuildEntity } from '.';
import type { TFunction } from 'i18next';
import type FoxxieClient from '../../FoxxieClient';
import { guildSettings } from '..';
import { container } from '@sapphire/framework';
import { toTitleCase } from '@ruffpuff/utilities';

export interface ExtraData {
    total?: number;
    nickname?: string;
}

export interface ModerationLanguageKeys {
    [key: string]: string;
}

export const kBigIntTransformer: ValueTransformer = {
    from: value => (isNullish(value) ? value : Number(value as string)),
    to: value => (isNullish(value) ? value : String(value as number))
};

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
    public extraData: unknown[] | ExtraData | null = null;

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
    public userId: string | null | string[] = null;

    @Column('bigint', { nullable: true, default: () => 'null', transformer: kBigIntTransformer })
    public duration: number | null = null;

    constructor(data: Partial<ModerationEntity>) {
        super();

        if (data) {
            Object.assign(this, data);
            this.type = ModerationEntity.getTypeFromDuration(this.type as number, this.duration);
        }
    }

    setup(manager: GuildModerationManager): ModerationEntity {
        this.#manager = manager;
        if (manager.guild) this.guildId = manager.guild.id;
        return this;
    }

    get appealTaskName(): string | null {
        if (!this.duration) return null;
        switch (this.title) {
        case 'tempMute':
            return TypeVariationAppealNames.Mute;
        case 'tempBan':
            return TypeVariationAppealNames.Ban;
        case 'tempNickname':
            return TypeVariationAppealNames.Nickname;
        default:
            return null;
        }
    }

    clone(): ModerationEntity {
        return new ModerationEntity(this).setup(this.#manager as GuildModerationManager);
    }

    equals(other: ModerationEntity): boolean {
        return (
            this.type === other.type
            && this.duration === other.duration
            && this.extraData === other.extraData
            && this.reason === other.reason
            && this.userId === other.userId
            && this.moderatorId === other.moderatorId
        );
    }

    get typeVariation(): number {
        return (this.type as number & TypeBits.Variation);
    }

    get guild(): Guild | null | undefined {
        return this.#manager?.guild;
    }

    get metadata(): ModerationTypeAssets {
        const data = metadata.get(this.type as number);
        if (typeof data === 'undefined') throw new Error(`Inexistent metadata for '0b${this.type?.toString(2).padStart(8, '0')}'.`);
        return data;
    }

    get title(): string {
        return this.metadata.title;
    }

    get color(): number {
        return this.metadata.color;
    }

    get createdTimestamp(): number {
        return this.createdAt?.getTime() ?? Date.now();
    }

    get client(): FoxxieClient {
        return container.client as FoxxieClient;
    }

    async create(): Promise<null | ModerationEntity> {
        // If the entry was created, there is no point on re-sending
        if (this.createdAt) return null;
        this.createdAt = new Date();

        const cases = await container.db.moderations.find({ guildId: this.guildId });

        this.caseId = cases.length + 1;
        this.#manager?.insert(this);

        this.guild?.client.emit(events.MODERATION_ENTRY_ADD, this);
        return this;
    }

    async edit(data: ModerationManagerDescriptionData | Record<string, unknown> = {}): Promise<ModerationEntity> {
        const dataWithType = { ...data, type: ModerationEntity.getTypeFromDuration(this.type as number, (data as ModerationManagerDescriptionData).duration ?? this.duration) };
        const clone = this.clone();
        try {
            Object.assign(this, dataWithType);
        } catch (error) {
            Object.assign(this, clone);
            throw error;
        }

        this.client?.emit(events.MODERATION_ENTRY_EDIT, clone, this);
        return this;
    }

    setExtraData(value: ExtraData): ModerationEntity {
        this.extraData = value;
        return this;
    }

    async fetchModerator(): Promise<User | null> {
        if (this.#moderator) return this.#moderator;
        const moderator = this.moderatorId
            ? await resolveToNull((this.client as FoxxieClient).users.fetch(this.moderatorId)) as User
            : null;

        if (moderator) this.#moderator = moderator;
        return moderator;
    }

    resolveData(): Partial<ModerationEntity> {
        return {
            logChannelId: this.logChannelId,
            logMessageId: this.logMessageId,
            moderatorId: this.moderatorId ?? null,
            channelId: this.channelId ?? null,
            type: this.type,
            createdAt: this.createdAt,
            duration: this.duration ?? null,
            userId: this.userId ?? null,
            caseId: this.caseId,
            extraData: this.extraData ?? null,
            reason: this.reason ?? null
        };
    }

    async prepareEmbed(): Promise<FoxxieEmbed> {
        const moderator = await this.fetchModerator();
        const description = await this.fetchDescriptionData(moderator as User);
        const formats = await this.formatTitle();
        const caseT = toTitleCase(formats.t(languageKeys.globals.caseT));

        const embed = new FoxxieEmbed(this.guild as Guild)
            .setAuthor(formats.title, moderator?.displayAvatarURL({ dynamic: true }))
            .setColor(this.color)
            .setTimestamp(this.createdTimestamp)
            .setDescription(description)
            .setFooter(`${caseT} #${formats.t(languageKeys.globals.numberFormat, { value: this.caseId })}`);

        return embed;
    }

    async formatTitle(): Promise<{ title: string, t: TFunction }> {
        const t: TFunction = await aquireSettings(this.guildId, (settings: GuildEntity) => settings.getLanguage());

        const total = this.getTotal();
        if (total) return t((languageKeys.moderation as unknown as ModerationLanguageKeys)[this.metadata.title], { count: total });

        const multipleUsers = Array.isArray(this.userId) ? this.userId.length : 1;
        return {
            title: t((languageKeys.moderation as unknown as ModerationLanguageKeys)[this.metadata.title], { count: multipleUsers }),
            t
        };
    }

    async fetchDescriptionData(_moderator: User): Promise<(string | null)[]> {
        const [prefix, t]: [prefix: string, t: TFunction] = await aquireSettings(this.guildId, (settings: GuildEntity) => [settings[guildSettings.prefix], settings.getLanguage()]);

        const [_users, _channel] = await Promise.all([this.fetchUser(), this.fetchChannel()]);
        const fillReason = t(languageKeys.moderation.fillReason, { prefix, count: this.caseId });

        return [
            _users
                ? !Array.isArray(this.userId)
                    ? t(languageKeys.guilds.logs.argsUser, { user: _users })
                    : t(languageKeys.guilds.logs.argsUsers, {
                        users: (this.userId as string[]).length > 30
                            ? await getHaste([
                                `Users`,
                                '',
                                `Timestamp: ${t(languageKeys.globals.dateFull, { date: Date.now() })}`,
                                `Guild: ${this.guild?.name} [${this.guild?.id}]`,
                                '',
                                ...(this.userId as string[])
                                    .map(id => (this.client as FoxxieClient).users.cache.get(id))
                                    .map(user => `${user?.tag} [${user?.id}]`)
                            ].join('\n'))
                                .then(res => `<${Urls.Haste}${res}>`)
                            : (_users as User[]).map((usr, idx) => `${idx + 1}. ${usr.tag} [${usr.id}]`).join('\n')
                    })
                : null,
            _channel
                ? `${t(languageKeys.guilds.logs.argsChannel, { channel: _channel })}\n`
                : null,
            _moderator
                ? t(languageKeys.guilds.logs.argsModerator, { mod: _moderator })
                : null,
            t(languageKeys.guilds.logs.argsReason, { reason: this.reason ?? fillReason }),
            this.duration
                ? t(languageKeys.guilds.logs.argsDuration, { duration: Date.now() - this.duration })
                : null,
            t(languageKeys.guilds.logs.argsDate, { date: this.createdTimestamp })
        ].filter(a => !!a);
    }

    async fetchUser(): Promise<null | User | User[]> {
        if (!this.userId) return null;
        if (Array.isArray(this.userId)) return this.fetchUsers();

        const previous = this.#user;
        if (previous?.id === this.userId) return previous;

        const user = await resolveToNull((this.client as FoxxieClient).users.fetch(this.userId)) as User | null;
        this.#user = user;
        return user;
    }

    async fetchUsers(): Promise<User[] | null | User> {
        if (!Array.isArray(this.userId)) throw new Error('userId must be an array of ids.');
        const _users = [];

        if (this.userId.length === 1) {
            // eslint-disable-next-line prefer-destructuring
            this.userId = this.userId[0];
            return this.fetchUser();
        }

        for (const id of this.userId) {
            const user = await resolveToNull((this.guild as Guild).client.users.fetch(id));
            if (user) _users.push(user);
        }

        return _users.length ? _users as User[] : null;
    }

    async fetchLogChannel(): Promise<GuildChannel | null> {
        if (this.#logChannel) return this.#logChannel;
        const channel = this.logChannelId
            ? await resolveToNull((this.guild as Guild).channels.fetch(this.logChannelId)) as GuildChannel
            : null;

        if (channel) this.#logChannel = channel;

        return channel;
    }

    async fetchChannel(): Promise<GuildChannel | null> {
        if (this.#channel) return this.#channel;
        const channel = this.channelId
            ? await resolveToNull((this.guild as Guild).channels.fetch(this.channelId)) as GuildChannel
            : null;

        if (channel) this.#channel = channel;

        return channel;
    }

    getTotal(): null | number {
        if (this.#total) return this.#total;
        if (!(this.extraData as ExtraData)?.total) return null;
        this.#total = (this.extraData as ExtraData)?.total ?? null;
        return this.#total;
    }

    static getTypeFromDuration(type: number, duration: number | null): number {
        if (duration === null) return type;
        if (duration < time.Minute) return type | TypeMetadata.Temporary | TypeMetadata.Fast;
        return type | TypeMetadata.Temporary;
    }


}