import type { HighlightTypeEnum } from '#lib/Container/Workers/types';
import { LanguageKeys } from '#lib/I18n';
import { create } from '#utils/regexCreator';
import { arrayStrictEquals, cast, minutes, years } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import type { APIEmbed, LocaleString, Snowflake } from 'discord-api-types/v10';
import type { Guild as DiscordGuild, UserResolvable } from 'discord.js';
import {
    AfterInsert,
    AfterLoad,
    AfterRemove,
    AfterUpdate,
    BaseEntity,
    Column,
    Entity,
    ObjectIdColumn,
    PrimaryColumn
} from 'typeorm';
import { ConfigurableKey } from '../../util';
import { Highlight } from '../Highlight';
import { GuildChannelSettingsService } from './Services/GuildChannelSettingsService';
import { GuildRoleSettingsService } from './Services/GuildRoleSettingsService';
import { GuildStarboardSettingsService } from './Services/GuildStarboardSettingsService';
import { Tag } from './Structures/Tag';
import { TFunction, getFixedT } from 'i18next';

@Entity('guild', { schema: 'public' })
export class GuildEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn()
    public id!: string;

    @Column()
    public channels: GuildChannelSettingsService;

    @ConfigurableKey({
        description: LanguageKeys.Settings.DisabledCommands,
        name: 'disabled-commands',
        type: 'command'
    })
    @Column('varchar', {
        name: 'disabledCommands',
        array: true,
        default: () => 'ARRAY[]::VARCHAR[]'
    })
    public disabledCommands: Snowflake[] = [];

    @Column('jsonb', { name: 'embedsBoost', nullable: true })
    public embedsBoost: null | APIEmbed;

    @Column('jsonb', { name: 'embedsDisboard', nullable: true })
    public embedsDisboard: null | APIEmbed;

    @Column('jsonb', { name: 'embedsGoodbye', nullable: true })
    public embedsGoodbye: null | APIEmbed;

    @Column('jsonb', { name: 'embedsWelcome', nullable: true })
    public embedsWelcome: null | APIEmbed;

    @ConfigurableKey({
        description: LanguageKeys.Settings.EventsBanAdd,
        type: 'boolean',
        name: 'events.ban-add'
    })
    @Column('boolean', { name: 'eventsBanAdd', default: true })
    public eventsBanAdd = true;

    @ConfigurableKey({
        description: LanguageKeys.Settings.EventsBanRemove,
        type: 'boolean',
        name: 'events.ban-remove'
    })
    @Column('boolean', { name: 'eventsBanRemove', default: true })
    public eventsBanRemove = true;

    @ConfigurableKey({
        description: LanguageKeys.Settings.EventsKick,
        type: 'boolean',
        name: 'events.kick'
    })
    @Column('boolean', { name: 'eventsKick', default: true })
    public eventsKick = true;

    @ConfigurableKey({
        description: LanguageKeys.Settings.EventsMuteAdd,
        type: 'boolean',
        name: 'events.mute-add'
    })
    @Column('boolean', { name: 'eventsBanAdd', default: true })
    public eventsMuteAdd = true;

    @ConfigurableKey({
        description: LanguageKeys.Settings.EventsMuteRemove,
        type: 'boolean',
        name: 'events.mute-remove'
    })
    @Column('boolean', { name: 'eventsMuteRemove', default: true })
    public eventsMuteRemove = true;

    @Column()
    public highlights: Highlight<HighlightTypeEnum>[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.Language,
        type: 'language'
    })
    @Column('varchar', { name: 'language', default: 'en-US' })
    public language = 'en-US';

    @Column('bigint', {
        default: 0,
        name: 'messageCount'
    })
    public messageCount = 0;

    @ConfigurableKey({
        description: LanguageKeys.Settings.MessagesBoost,
        name: 'messages.boost',
        type: 'string'
    })
    @Column('varchar', { name: 'messagesBoost', nullable: true, length: 2000 })
    public messagesBoost: string | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.MessagesDisboard,
        name: 'messages.disboard',
        type: 'string'
    })
    @Column('varchar', {
        name: 'messagesDisboard',
        nullable: true,
        length: 2000
    })
    public messagesDisboard: string | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.MessagesGoodbye,
        name: 'messages.goodbye',
        type: 'string'
    })
    @Column('varchar', {
        name: 'messagesGoodbye',
        nullable: true,
        length: 2000
    })
    public messagesGoodbye: string | null = null;

    @ConfigurableKey({
        type: 'timespan',
        description: LanguageKeys.Settings.MessagesGoodbyeAutoDelete,
        name: 'messages.auto-delete.goodbye',
        minimum: 0,
        maximum: minutes(15)
    })
    @Column('bigint', {
        name: 'messagesGoodbyeAutoDelete',
        nullable: true
    })
    public messagesGoodbyeAutoDelete: number | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.MessagesModerationAutoDelete,
        name: 'moderation.auto-delete',
        type: 'boolean'
    })
    @Column('boolean', { name: 'messagesModerationAutoDelete', default: false })
    public messagesModerationAutoDelete = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.MessagesWelcome,
        name: 'messages.welcome',
        type: 'string'
    })
    @Column('varchar', {
        name: 'messagesWelcome',
        nullable: true,
        length: 2000
    })
    public messagesWelcome: string | null = null;

    @ConfigurableKey({
        type: 'timespan',
        description: LanguageKeys.Settings.MessagesWelcomeAutoDelete,
        name: 'messages.auto-delete.welcome',
        minimum: 0,
        maximum: minutes(15)
    })
    @Column('bigint', {
        name: 'messagesWelcomeAutoDelete',
        nullable: true
    })
    public messagesWelcomeAutoDelete: number | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationChannelsIgnoreALl,
        name: 'moderation.auto.ignored-channels',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'moderationChannelsIgnoreAll', array: true })
    public moderationChannelsIgnoreAll: Snowflake[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationDm,
        name: 'moderation.dm',
        type: 'boolean'
    })
    @Column('boolean', { name: 'moderationDm', default: true })
    public moderationDm = true;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationGiftsEnabled,
        name: 'moderation.auto.gifts.enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'moderationGiftsEnabled', default: false })
    public moderationGiftsEnabled = false;

    // @ConfigurableKey({
    //     description: LanguageKeys.Settings.ModerationGiftsSoftPunish,
    //     name: 'moderation.auto.gifts.action',
    //     type: 'softaction'
    // })
    @Column('smallint', { name: 'moderationGiftsSoftPunish', default: 0 })
    public moderationGiftsSoftPunish = 0;

    @Column('smallint', { name: 'moderationGiftsHardPunish', default: 0 })
    public moderationGiftsHardPunish = 0;

    @ConfigurableKey({
        type: 'timespan',
        description: LanguageKeys.Settings.ModerationGiftsHardPunishDuration,
        name: 'moderation.auto.gifts.duration',
        minimum: 0,
        maximum: years(5)
    })
    @Column('bigint', {
        name: 'moderationGiftsHardPunishDuration',
        nullable: true
    })
    public moderationGiftsHardPunishDuration: number | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationInvitesEnabled,
        name: 'moderation.auto.invites.enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'moderationInvitesEnabled', default: false })
    public moderationInvitesEnabled = false;

    @Column('smallint', { name: 'moderationInvitesSoftPunish', default: 0 })
    public moderationInvitesSoftPunish = 0;

    @Column('smallint', { name: 'moderationInvitesHardPunish', default: 0 })
    public moderationInvitesHardPunish = 0;

    @ConfigurableKey({
        type: 'timespan',
        description: LanguageKeys.Settings.ModerationInvitesHardPunishDuration,
        name: 'moderation.auto.invites.duration',
        minimum: 0,
        maximum: years(5)
    })
    @Column('bigint', {
        name: 'moderationInvitesHardPunishDuration',
        nullable: true
    })
    public moderationInvitesHardPunishDuration: number | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationScamsEnabled,
        name: 'moderation.auto.scams.enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'moderationScamsEnabled', default: false })
    public moderationScamsEnabled = false;

    @Column('smallint', { name: 'moderationScamsSoftPunish', default: 0 })
    public moderationScamsSoftPunish = 0;

    @Column('smallint', { name: 'moderationScamsHardPunish', default: 0 })
    public moderationScamsHardPunish = 0;

    @ConfigurableKey({
        type: 'timespan',
        description: LanguageKeys.Settings.ModerationScamsHardPunishDuration,
        name: 'moderation.auto.scams.duration',
        minimum: 0,
        maximum: years(5)
    })
    @Column('bigint', {
        name: 'moderationScamsHardPunishDuration',
        nullable: true
    })
    public moderationScamsHardPunishDuration: number | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.PermissionNodesEnabled,
        name: 'moderation.nodes-enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'permissionNodesEnabled', default: true })
    public permissionNodesEnabled = true;

    @Column('jsonb', {
        name: 'permissionNodesRoles',
        default: () => "'[]'::JSONB"
    })
    public permissionNodesRoles: PermissionNode[] = [];

    @Column('jsonb', {
        name: 'permissionNodesUsers',
        default: () => "'[]'::JSONB"
    })
    public permissionNodesUsers: PermissionNode[] = [];

    @Column('jsonb', { name: 'persistRoles', default: () => "'[]'::JSONB" })
    public persistRoles: PersistRole[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.RolesPersistEnabled,
        name: 'roles.persist-enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'persistRolesEnabled', default: false })
    public persistRolesEnabled = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.Prefix,
        minimum: 1,
        maximum: 10
    })
    @Column('varchar', {
        name: 'prefix',
        length: 10,
        default: process.env.CLIENT_PREFIX
    })
    public prefix = process.env.CLIENT_PREFIX;

    @ConfigurableKey({
        description: LanguageKeys.Settings.RaidChannel,
        name: 'raid.channel',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'raidChannel', nullable: true, length: 19 })
    public raidChannel: Snowflake | null = null;

    @Column('jsonb', { name: 'reactionRoles', default: () => "'[]'::JSONB" })
    public reactionRoles: FoxxieReactionRole[] = [];

    @Column()
    public roles: GuildRoleSettingsService;

    @Column()
    public starboard: GuildStarboardSettingsService;

    @Column()
    public tags: Tag[] = [];

    @Column('varchar', {
        name: 'words',
        default: () => "'[]'::JSONB",
        array: true
    })
    public words: Word[] = [];

    public wordFilterRegExp: RegExp | null = null;

    public constructor() {
        super();
        this.entityLoad();
    }

    public getUserHighlight(user: UserResolvable): Highlight<HighlightTypeEnum>[] {
        const userId = container.client.users.resolveId(user);
        return this.highlights.filter(highlight => highlight.userId === userId);
    }

    public getLanguage(): TFunction {
        return getFixedT(cast<LocaleString>(this.language));
    }

    @AfterLoad()
    protected entityLoad() {
        this.wordFilterRegExp = this.words.length ? create(this.words.map(en => en.word)) : null;

        this.channels = new GuildChannelSettingsService(this.channels);

        this.roles = new GuildRoleSettingsService(this.roles);

        this.starboard = new GuildStarboardSettingsService(this.starboard);

        this.tags = this.tags.map(t => new Tag(t));
    }

    @AfterInsert()
    @AfterUpdate()
    protected entityUpdate() {
        if (!arrayStrictEquals(this.words, this.words)) {
            this.wordFilterRegExp = this.words.length ? create(this.words.map(en => en.word)) : null;
        }
    }

    @AfterRemove()
    protected entityRemove() {
        this.wordFilterRegExp = null;
    }

    public get guild(): DiscordGuild {
        return container.client.guilds.cache.get(this.id)!;
    }
}

export interface PermissionNode {
    allowed: string[];
    denied: string[];
    id: string;
}

export interface PersistRole {
    userId: string;
    roles: string[];
}

export interface Word {
    word: string;
    softPunish: number;
    hardPunish: number;
    hardPunishDuration: number | null;
}

export interface FoxxieReactionRole {
    messageId: string;
    roleId: string;
    channelId: string;
    emoji: string;
}
