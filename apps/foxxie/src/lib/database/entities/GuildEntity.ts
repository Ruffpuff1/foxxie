import { container } from '@sapphire/framework';
import { BaseEntity, Entity, ObjectIdColumn, Column, PrimaryColumn, AfterLoad, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';
import type { TFunction } from 'i18next';
import type { Guild, UserResolvable } from 'discord.js';
import { kBigIntTransformer } from '../transformers';
import { arrayStrictEquals, minutes, years } from '@ruffpuff/utilities';
import { create } from '#utils/regexCreator';
import { ConfigurableKey } from '../util';
import { LanguageKeys } from '#lib/i18n';
import type { APIEmbed, LocaleString, Snowflake } from 'discord-api-types/v9';
import type { HighlightTypeEnum } from '#lib/structures/workers/types';
import { getT } from '@foxxie/i18n';

@Entity('guild', { schema: 'public' })
export class GuildEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn()
    public id!: string;

    @ConfigurableKey({
        description: LanguageKeys.Settings.AfkPrefix,
        name: 'afk.prefix'
    })
    @Column('varchar', { name: 'afkPrefix', nullable: true, length: 32 })
    public afkPrefix: string | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.AfkRole,
        name: 'afk.role',
        type: 'role'
    })
    @Column('varchar', { name: 'afkRole', nullable: true, length: 19 })
    public afkRole: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.AnnouncementChannel,
        name: 'announcement.channel',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'announcementChannel',
        nullable: true,
        length: 19
    })
    public announcementChannel: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.AnnouncementRole,
        name: 'announcement.role',
        type: 'role'
    })
    @Column('varchar', { name: 'announcementRole', nullable: true, length: 19 })
    public announcementRole: Snowflake | null = null;

    @Column('varchar', {
        name: 'announcementWebhook',
        nullable: true,
        length: 19
    })
    public announcementWebhook: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.Autoroles,
        name: 'roles.auto',
        type: 'role'
    })
    @Column('varchar', { name: 'autoroles', array: true, length: 19 })
    public autoroles: Snowflake[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.BirthdayChannel,
        name: 'birthday.channel',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'birthdayChannel', nullable: true, length: 19 })
    public birthdayChannel: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.BirthdayMessage,
        name: 'birthday.message'
    })
    @Column('varchar', { name: 'birthdayMessage', nullable: true, length: 200 })
    public birthdayMessage: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.BirthdayRole,
        name: 'birthday.role',
        type: 'role'
    })
    @Column('varchar', { name: 'birthdayRole', nullable: true, length: 19 })
    public birthdayRole: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.Botroles,
        name: 'roles.bot',
        type: 'role'
    })
    @Column('varchar', { name: 'botroles', array: true, length: 19 })
    public botroles: Snowflake[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsBoost,
        name: 'channels.boost',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'channelsBoost', nullable: true, length: 19 })
    public channelsBoost: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsDisboard,
        name: 'channels.disboard',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'channelsDisboard', nullable: true, length: 19 })
    public channelsDisboard: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsGoodbye,
        name: 'channels.goodbye',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'channelsGoodbye', nullable: true, length: 19 })
    public channelsGoodbye: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsIgnoreAll,
        type: 'textchannel',
        name: 'channels.ignore.all'
    })
    @Column('varchar', {
        name: 'channelsIgnoreAll',
        length: 19,
        array: true,
        default: () => 'ARRAY[]::VARCHAR[]'
    })
    public channelsIgnoreAll: Snowflake[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsDisboard,
        name: 'channels.logs.disboard',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsLogsDisboard',
        nullable: true,
        length: 19
    })
    public channelsLogsDisboard: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsFilterInvites,
        name: 'channels.logs.filter.invites',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'channelsLogsFilterInvites', nullable: true, length: 19 })
    public channelsLogsFilterInvites: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsFilterWords,
        name: 'channels.logs.filter.words',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'channelsLogsFilterWords', nullable: true, length: 19 })
    public channelsLogsFilterWords: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsMemberJoin,
        name: 'channels.logs.member-join',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsLogsMemberJoin',
        nullable: true,
        length: 19
    })
    public channelsLogsMemberJoin: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsMemberLeave,
        name: 'channels.logs.member-leave',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsLogsMemberLeave',
        nullable: true,
        length: 19
    })
    public channelsLogsMemberLeave: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsMemberScreening,
        name: 'channels.logs.member-screening',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsLogsMemberScreening',
        nullable: true,
        length: 19
    })
    public channelsLogsMemberScreening: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsMessageDelete,
        name: 'channels.logs.message-delete',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsLogsMessageDelete',
        nullable: true,
        length: 19
    })
    public channelsLogsMessageDelete: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsMessageEdit,
        name: 'channels.logs.message-edit',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsLogsMessageEdit',
        nullable: true,
        length: 19
    })
    public channelsLogsMessageEdit: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsModeration,
        name: 'channels.logs.moderation',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsLogsModeration',
        nullable: true,
        length: 19
    })
    public channelsLogsModeration: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsLogsRoleUpdate,
        name: 'channels.logs.role-update',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsLogsRoleUpdate',
        nullable: true,
        length: 19
    })
    public channelsLogsRoleUpdate: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsStatsMemberCountChannel,
        name: 'channels.stats.member-count.channel',
        type: 'voicechannel'
    })
    @Column('varchar', {
        name: 'channelsStatsMemberCountChannel',
        nullable: true,
        length: 19
    })
    public channelsStatsMemberCountChannel: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsStatsMemberCountCompact,
        name: 'channels.stats.member-count.compact',
        type: 'boolean'
    })
    @Column('boolean', {
        name: 'channelsStatsMemberCountCompact',
        default: false
    })
    public channelsStatsMemberCountCompact = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsStatsMemberCountTemplate,
        name: 'channels.stats.member-count.template',
        type: 'string'
    })
    @Column('varchar', {
        name: 'channelsStatsMemberCountTemplate',
        nullable: true,
        length: 30
    })
    public channelsStatsMemberCountTemplate: string | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsStatusUpdate,
        name: 'channels.status-update',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'channelsStatusUpdate',
        nullable: true,
        length: 19
    })
    public channelsStatusUpdate: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ChannelsWelcome,
        name: 'channels.welcome',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'channelsWelcome', nullable: true, length: 19 })
    public channelsWelcome: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ClockChannel,
        name: 'channels.clock.channel',
        type: 'voicechannel'
    })
    @Column('varchar', { name: 'clockChannel', nullable: true, length: 19 })
    public clockChannel: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ClockEmojiStyle,
        name: 'channels.clock.emoji-style',
        type: 'number'
    })
    @Column('varchar', { name: 'clockEmojiStyle', default: 0, length: 5 })
    public clockEmojiStyle: ClockEmojiStyle = 0;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ClockTemplate,
        name: 'channels.clock.template',
        type: 'string'
    })
    @Column('varchar', { name: 'clockTemplate', nullable: true, length: 30 })
    public clockTemplate: string | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ClockTimezone,
        name: 'channels.clock.timezone',
        type: 'string'
    })
    @Column('varchar', { name: 'clockTimezone', default: 'UTC', length: 30 })
    public clockTimezone = 'UTC';

    @ConfigurableKey({
        description: LanguageKeys.Settings.CommandChannels,
        name: 'command-channels',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'commandChannels', array: true, length: 19 })
    public commandChannels: Snowflake[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.DisabledChannels,
        name: 'disabled-channels',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'disabledChannels', array: true, length: 19 })
    public disabledChannels: Snowflake[] = [];

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

    @ConfigurableKey({
        description: LanguageKeys.Settings.GiveawayDm,
        type: 'boolean',
        name: 'giveaway.dm'
    })
    @Column('boolean', { name: 'giveawayDm', default: false })
    public giveawayDm = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.GiveawayEmoji,
        type: 'emoji',
        name: 'giveaway.emoji'
    })
    @Column('varchar', { default: encodeURIComponent('🎉') })
    public giveawayEmoji = encodeURIComponent('🎉');

    @ConfigurableKey({
        description: LanguageKeys.Settings.GiveawayMentionWinners,
        type: 'boolean',
        name: 'giveaway.mention-winners'
    })
    @Column('boolean', { name: 'giveawayMentionWinners', default: true })
    public giveawayMentionWinners = true;

    @ConfigurableKey({
        description: LanguageKeys.Settings.GiveawayRemoveReactions,
        type: 'boolean',
        name: 'giveaway.remove-reactions'
    })
    @Column('boolean', { name: 'giveawayRemoveReactions', default: false })
    public giveawayRemoveReactions = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.GiveawayReplyToMessage,
        type: 'boolean',
        name: 'giveaway.reply-to-message'
    })
    @Column('boolean', { name: 'giveawayReplyToMessage', default: true })
    public giveawayReplyToMessage = true;

    @Column('jsonb', { name: 'highlights', default: () => "'[]'::JSONB" })
    public highlights: Highlight<HighlightTypeEnum>[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.Language,
        type: 'language'
    })
    @Column('varchar', { name: 'language', default: 'en-US' })
    public language = 'en-US';

    @ConfigurableKey({
        description: LanguageKeys.Settings.LevelingEnabled,
        name: 'leveling.enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'levelingEnabled', default: false })
    public levelingEnabled = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.LevelingIgnoredChannels,
        name: 'leveling.ignored-channels',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'levelingIgnoredChannels',
        length: 19,
        array: true,
        default: () => 'ARRAY[]::VARCHAR[]'
    })
    public levelingIgnoredChannels: Snowflake[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.LevelingMessagesEnabled,
        name: 'leveling.messages-enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'levelingMessagesEnabled', default: true })
    public levelingMessagesEnabled = true;

    @ConfigurableKey({
        description: LanguageKeys.Settings.LevelingRoles,
        name: 'leveling.roles',
        type: 'lvlrole',
        array: true
    })
    @Column('jsonb', { name: 'levelingRoles', default: () => "'[]'::JSONB" })
    public levelingRoles: LevelingRole[] = [];

    @Column('bigint', {
        default: 0,
        transformer: kBigIntTransformer,
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
        nullable: true,
        transformer: kBigIntTransformer
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
        nullable: true,
        transformer: kBigIntTransformer
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

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationGiftsSoftPunish,
        name: 'moderation.auto.gifts.action',
        type: 'softaction'
    })
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
        nullable: true,
        transformer: kBigIntTransformer
    })
    public moderationGiftsHardPunishDuration: number | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationInvitesEnabled,
        name: 'moderation.auto.invites.enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'moderationInvitesEnabled', default: false })
    public moderationInvitesEnabled = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationInvitesSoftPunish,
        name: 'moderation.auto.invites.action',
        type: 'softaction'
    })
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
        nullable: true,
        transformer: kBigIntTransformer
    })
    public moderationInvitesHardPunishDuration: number | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationScamsEnabled,
        name: 'moderation.auto.scams.enabled',
        type: 'boolean'
    })
    @Column('boolean', { name: 'moderationScamsEnabled', default: false })
    public moderationScamsEnabled = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationScamsSoftPunish,
        name: 'moderation.auto.scams.action',
        type: 'softaction'
    })
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
        nullable: true,
        transformer: kBigIntTransformer
    })
    public moderationScamsHardPunishDuration: number | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.ModerationMuteTimeout,
        name: 'moderation.mute-timeout',
        type: 'boolean'
    })
    @Column('boolean', { name: 'moderationMuteTimeout', default: true })
    public moderationMuteTimeout = true;

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
    public reactionRoles: ReactionRole[] = [];

    @Column('jsonb', { name: 'regexTags', default: () => "'[]'::JSONB" })
    public regexTags: RegexTag[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.RolesEmbedRestrict,
        name: 'roles.embed-restrict',
        type: 'role'
    })
    @Column('varchar', {
        name: 'rolesEmbedRestrict',
        nullable: true,
        length: 19
    })
    public rolesEmbedRestrict: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.RolesMuted,
        name: 'roles.muted',
        type: 'role'
    })
    @Column('varchar', { name: 'rolesMuted', nullable: true, length: 19 })
    public rolesMuted: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.RolesPronounsHeHim,
        name: 'roles.pronouns.he/him',
        type: 'role'
    })
    @Column('varchar', {
        name: 'rolesPronounsHeHim',
        length: 19,
        nullable: true
    })
    public rolesPronounsHeHim: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.RolesPronounsItIts,
        name: 'roles.pronouns.it/its',
        type: 'role'
    })
    @Column('varchar', {
        name: 'rolesPronounsItIts',
        length: 19,
        nullable: true
    })
    public rolesPronounsItIts: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.RolesPronounsSheHer,
        name: 'roles.pronouns.she/her',
        type: 'role'
    })
    @Column('varchar', {
        name: 'rolesPronounsSheHer',
        length: 19,
        nullable: true
    })
    public rolesPronounsSheHer: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.RolesPronounsTheyThem,
        name: 'roles.pronouns.they/them',
        type: 'role'
    })
    @Column('varchar', {
        name: 'rolesPronounsTheyThem',
        length: 19,
        nullable: true
    })
    public rolesPronounsTheyThem: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.StarboardChannel,
        name: 'starboard.channel',
        type: 'textchannel'
    })
    @Column('varchar', { name: 'starboardChannel', nullable: true, length: 19 })
    public starboardChannel: Snowflake | null = null;

    @ConfigurableKey({
        description: LanguageKeys.Settings.StarboardIgnoredChannels,
        name: 'starboard.ignored-channels',
        type: 'textchannel'
    })
    @Column('varchar', {
        name: 'starboardIgnoreChannels',
        length: 19,
        array: true,
        default: () => 'ARRAY[]::VARCHAR[]'
    })
    public starboardIgnoreChannels: Snowflake[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.StarboardMinimum,
        name: 'starboard.minimum',
        minimum: 1
    })
    @Column('smallint', { name: 'starboardMinimum', default: 3 })
    public starboardMinimum = 3;

    @ConfigurableKey({
        description: LanguageKeys.Settings.StarboardNotifications,
        name: 'starboard.notifications',
        type: 'boolean'
    })
    @Column('boolean', { name: 'starboardNotifs', default: false })
    public starboardNotifs = false;

    @ConfigurableKey({
        description: LanguageKeys.Settings.StarboardSelfStar,
        name: 'starboard.self-star',
        type: 'boolean'
    })
    @Column('boolean', { name: 'starboardSelfStar', default: false })
    public starboardSelfStar = false;

    @Column('jsonb', { name: 'tags', default: () => "'[]'::JSONB" })
    public tags: Tag[] = [];

    @ConfigurableKey({
        description: LanguageKeys.Settings.Words,
        type: 'word',
        name: 'moderation.auto.words.words'
    })
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

    public getUserHighlight(user: UserResolvable): Highlight<HighlightTypeEnum.Regex | HighlightTypeEnum.Word>[] {
        const userId = container.client.users.resolveId(user);
        return this.highlights.filter(highlight => highlight.userId === userId);
    }

    public getLanguage(): TFunction {
        return getT(this.language as LocaleString);
    }

    @AfterLoad()
    protected entityLoad() {
        this.wordFilterRegExp = this.words.length ? create(this.words.map(en => en.word)) : null;
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

    public get guild(): Guild {
        return container.client.guilds.cache.get(this.id)!;
    }
}

export const enum ClockEmojiStyle {
    Scene,
    Clock
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

export interface Highlight<T extends HighlightTypeEnum> {
    word: T extends HighlightTypeEnum.Regex ? RegExp : string;
    userId: string;
    type: T;
}

export interface ReactionRole {
    messageId: string;
    roleId: string;
    channelId: string;
    emoji: string;
}

export interface Tag {
    id: string;
    delete: boolean;
    embed: boolean;
    color: number;
    aliases: string[];
    content: string;
}

export interface RegexTag {
    id: RegExp;
    delete: boolean;
    embed: boolean;
    color: number;
    content: string;
}

export interface LevelingRole {
    id: string;
    level: number;
}
