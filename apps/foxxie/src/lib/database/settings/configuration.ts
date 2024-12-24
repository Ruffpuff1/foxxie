import { objectEntries } from '@sapphire/utilities';
import { ConfigurableKeyValueOptions, type GuildDataKey, NonEmptyArray, SchemaKey } from '#lib/database';
import { SchemaGroup } from '#lib/database/settings/schema/SchemaGroup';
import { LanguageKeys } from '#lib/i18n';
import { years } from '#utils/common';
import { APIApplicationCommandOptionChoice, Collection } from 'discord.js';

export type SchemaDataKey = Exclude<
	GuildDataKey,
	'disabledCommandsChannels' | 'highlights' | 'id' | 'messageCount' | 'reactionRoles' | 'rolesPersist' | 'starboardEmojis' | 'tags' | 'words'
>;

const configurableKeys = new Collection<SchemaDataKey, SchemaKey>();
const configurableGroups = new SchemaGroup('::ROOT::');

export function getConfigurableGroups(): SchemaGroup {
	getConfiguration();
	return configurableGroups;
}

export function getConfigurableKeys(): Collection<SchemaDataKey, SchemaKey> {
	getConfiguration();
	return configurableKeys;
}

let cachedConfiguration: null | Record<SchemaDataKey, SchemaKey> = null;
export function getConfiguration() {
	cachedConfiguration ??= makeKeys({
		birthdayChannel: {
			name: 'modules.birthday.channel',
			type: 'sendableChannel'
		},
		birthdayRole: {
			name: 'modules.birthday.role',
			type: 'role'
		},
		channelsIgnoreAll: {
			array: true,
			name: 'modules.logs.ignore.all',
			type: 'guildTextChannel'
		},
		channelsIgnoreMessageDelete: {
			array: true,
			name: 'modules.logs.ignore.message-delete',
			type: 'guildTextChannel'
		},
		channelsIgnoreMessageEdit: {
			array: true,
			name: 'modules.logs.ignore.message-edit',
			type: 'guildTextChannel'
		},
		channelsIgnoreReactionAdd: {
			array: true,
			name: 'modules.logs.ignore.reaction-add',
			type: 'guildTextChannel'
		},
		channelsLogsChannelCreate: {
			name: 'modules.logs.channel-create',
			type: 'guildTextChannel'
		},
		channelsLogsChannelDelete: {
			name: 'modules.logs.channel-delete',
			type: 'guildTextChannel'
		},
		channelsLogsChannelUpdate: {
			name: 'modules.logs.channel-update',
			type: 'guildTextChannel'
		},
		channelsLogsEmojiCreate: {
			name: 'modules.logs.emoji-create',
			type: 'guildTextChannel'
		},
		channelsLogsEmojiDelete: {
			name: 'modules.logs.emoji-delete',
			type: 'guildTextChannel'
		},
		channelsLogsEmojiUpdate: {
			name: 'modules.logs.emoji-update',
			type: 'guildTextChannel'
		},
		channelsLogsImage: {
			name: 'modules.logs.image',
			type: 'guildTextChannel'
		},
		channelsLogsMemberAdd: {
			name: 'modules.logs.member-add',
			type: 'guildTextChannel'
		},
		channelsLogsMemberNicknameUpdate: {
			name: 'modules.logs.member-nickname-update',
			type: 'guildTextChannel'
		},
		channelsLogsMemberRemove: {
			name: 'modules.logs.member-remove',
			type: 'guildTextChannel'
		},
		channelsLogsMemberRolesUpdate: {
			name: 'modules.logs.member-roles-update',
			type: 'guildTextChannel'
		},
		channelsLogsMemberUsernameUpdate: {
			name: 'modules.logs.member-username-update',
			type: 'guildTextChannel'
		},
		channelsLogsMessageDelete: {
			name: 'modules.logs.message-delete',
			type: 'guildTextChannel'
		},
		channelsLogsMessageDeleteNsfw: {
			name: 'modules.logs.message-delete-nsfw',
			type: 'guildTextChannel'
		},
		channelsLogsMessageUpdate: {
			name: 'modules.logs.message-update',
			type: 'guildTextChannel'
		},
		channelsLogsMessageUpdateNsfw: {
			name: 'modules.logs.message-update-nsfw',
			type: 'guildTextChannel'
		},
		channelsLogsModeration: {
			name: 'modules.logs.moderation',
			type: 'guildTextChannel'
		},
		channelsLogsPrune: {
			name: 'modules.logs.prune',
			type: 'guildTextChannel'
		},
		channelsLogsReaction: {
			name: 'modules.logs.reaction',
			type: 'guildTextChannel'
		},
		channelsLogsRoleCreate: {
			name: 'modules.logs.role-create',
			type: 'guildTextChannel'
		},
		channelsLogsRoleDelete: {
			name: 'modules.logs.role-delete',
			type: 'guildTextChannel'
		},
		channelsLogsRoleUpdate: {
			name: 'modules.logs.role-update',
			type: 'guildTextChannel'
		},
		channelsLogsServerUpdate: {
			name: 'modules.logs.server-update',
			type: 'guildTextChannel'
		},
		channelsLogsVoiceActivity: {
			name: 'modules.logs.voice-activity',
			type: 'guildTextChannel'
		},
		channelsMediaOnly: {
			array: true,
			name: 'channels.media-only',
			type: 'guildTextChannel'
		},
		disabledChannels: {
			array: true,
			description: LanguageKeys.Settings.DisabledChannels,
			name: 'disabled-channels',
			type: 'guildTextChannel'
		},
		disabledCommands: {
			array: true,
			description: LanguageKeys.Settings.DisabledCommands,
			maximum: 32,
			name: 'disabled-commands',
			type: 'commandMatch'
		},
		disableNaturalPrefix: {
			default: false,
			name: 'disable-natural-prefix',
			type: 'boolean'
		},
		disboardChannel: {
			name: 'modules.automation.disboard.channel',
			type: 'sendableChannel'
		},
		disboardEmbed: {
			name: 'modules.automation.disboard.embed',
			type: 'string'
		},

		disboardMessage: {
			maximum: 1500,
			minimum: 1,
			name: 'modules.automation.disboard.message',
			type: 'string'
		},

		eventsBanAdd: {
			description: LanguageKeys.Settings.EventsBanAdd,
			name: 'modules.moderation.events.ban-add',
			type: 'boolean'
		},
		eventsBanRemove: {
			description: LanguageKeys.Settings.EventsBanRemove,
			name: 'modules.moderation.events.ban-remove',
			type: 'boolean'
		},
		eventsKick: {
			description: LanguageKeys.Settings.EventsKick,
			name: 'modules.moderation.events.kick',
			type: 'boolean'
		},
		eventsMuteAdd: {
			description: LanguageKeys.Settings.EventsMuteAdd,
			name: 'modules.moderation.events.mute-add',
			type: 'boolean'
		},
		eventsMuteRemove: {
			description: LanguageKeys.Settings.EventsMuteRemove,
			name: 'modules.moderation.events.mute-remove',
			type: 'boolean'
		},

		language: {
			default: 'en-US',
			description: LanguageKeys.Settings.Language,
			type: 'language'
		},
		messagesAutoDeleteIgnoredAll: {
			default: false,
			name: 'messages.auto-delete.ignored-all',
			type: 'boolean'
		},
		messagesAutoDeleteIgnoredChannels: {
			array: true,
			name: 'messages.auto-delete.ignored-channels',
			type: 'guildTextChannel'
		},
		messagesAutoDeleteIgnoredCommands: {
			array: true,
			name: 'messages.auto-delete.ignored-commands',
			type: 'commandMatch'
		},
		messagesAutoDeleteIgnoredRoles: {
			array: true,
			name: 'messages.auto-delete.ignored-roles',
			type: 'role'
		},
		messagesIgnoreChannels: {
			array: true,
			name: 'messages.ignore-channels',
			type: 'guildTextChannel'
		},
		messagesModerationAutoDelete: {
			default: false,
			description: LanguageKeys.Settings.MessagesModerationAutoDelete,
			name: 'modules.moderation.messages.auto-delete',
			type: 'boolean'
		},
		messagesModerationDm: {
			description: LanguageKeys.Settings.ModerationDm,
			name: 'modules.moderation.messages.dm',
			type: 'boolean'
		},
		messagesModerationMessageDisplay: {
			default: true,
			name: 'modules.moderation.messages.message-display',
			type: 'boolean'
		},
		messagesModerationReasonDisplay: {
			default: true,
			name: 'modules.moderation.messages.reason-display',
			type: 'boolean'
		},
		messagesModeratorNameDisplay: {
			default: true,
			name: 'modules.moderation.messages.moderator-name-display',
			type: 'boolean'
		},
		permissionsRoles: {
			array: true,
			dashboardOnly: true,
			name: 'modules.permissions.roles',
			type: 'permissionNode'
		},
		permissionsUsers: {
			array: true,
			dashboardOnly: true,
			name: 'modules.permissions.users',
			type: 'permissionNode'
		},
		prefix: {
			default: 'd.',
			description: LanguageKeys.Settings.Prefix,
			maximum: 10,
			minimum: 1,
			type: 'string'
		},

		rolesAdmin: {
			array: true,
			name: 'modules.moderation.roles.admin',
			type: 'role'
		},
		rolesInitialBots: {
			array: true,
			description: LanguageKeys.Settings.Botroles,
			name: 'modules.automation.roles.initial-bots',
			type: 'role'
		},
		rolesInitialHumans: {
			array: true,
			description: LanguageKeys.Settings.Autoroles,
			name: 'modules.automation.roles.initial-humans',
			type: 'role'
		},
		rolesModerator: {
			array: true,
			name: 'modules.moderation.roles.moderator',
			type: 'role'
		},
		rolesMuted: {
			description: LanguageKeys.Settings.RolesMuted,
			name: 'modules.moderation.roles.muted',
			type: 'role'
		},

		rolesPersistEnabled: {
			description: LanguageKeys.Settings.RolesPersistEnabled,
			name: 'modules.automation.persist-roles-enabled',
			type: 'boolean'
		},
		rolesRestrictedAttachment: {
			name: 'modules.moderation.roles.restricted-attachment',
			type: 'role'
		},
		rolesRestrictedEmbed: {
			description: LanguageKeys.Settings.RolesEmbedRestrict,
			name: 'modules.moderation.roles.restricted-embed',
			type: 'role'
		},
		rolesRestrictedEmoji: {
			name: 'modules.moderation.roles.restricted-emoji',
			type: 'role'
		},
		rolesRestrictedReaction: {
			name: 'modules.moderation.roles.restricted-reaction',
			type: 'role'
		},
		rolesRestrictedVoice: {
			name: 'modules.moderation.roles.restricted-voice',
			type: 'role'
		},
		selfmodAttachmentsEnabled: {
			default: false,
			name: 'modules.moderation.selfmod.attachments.enabled',
			type: 'boolean'
		},
		selfmodAttachmentsHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.attachments.hard-action',
			type: 'integer'
		},
		selfmodAttachmentsHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.attachments.hard-action-duration',
			type: 'timespan'
		},
		selfmodAttachmentsIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.attachments.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodAttachmentsIgnoredRoles: {
			array: true,
			name: 'modules.moderation.selfmod.attachments.ignored-roles',
			type: 'role'
		},
		selfmodAttachmentsSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.attachments.soft-action',
			type: 'integer'
		},
		selfmodAttachmentsThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.attachments.threshold-duration',
			type: 'timespan'
		},
		selfmodAttachmentsThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.moderation.selfmod.attachments.threshold-maximum',
			type: 'integer'
		},
		selfmodCapitalsEnabled: {
			default: false,
			name: 'modules.moderation.selfmod.capitals.enabled',
			type: 'boolean'
		},
		selfmodCapitalsHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.capitals.hard-action',
			type: 'integer'
		},
		selfmodCapitalsHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.capitals.hard-action-duration',
			type: 'timespan'
		},
		selfmodCapitalsIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.capitals.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodCapitalsIgnoredRoles: {
			array: true,
			name: 'modules.moderation.selfmod.capitals.ignored-roles',
			type: 'role'
		},
		selfmodCapitalsMaximum: {
			default: 50,
			maximum: 100,
			minimum: 10,
			name: 'modules.moderation.selfmod.capitals.maximum',
			type: 'integer'
		},
		selfmodCapitalsMinimum: {
			default: 15,
			maximum: 2000,
			minimum: 5,
			name: 'modules.moderation.selfmod.capitals.minimum',
			type: 'integer'
		},
		selfmodCapitalsSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.capitals.soft-action',
			type: 'integer'
		},
		selfmodCapitalsThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.capitals.threshold-duration',
			type: 'timespan'
		},
		selfmodCapitalsThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.moderation.selfmod.capitals.threshold-maximum',
			type: 'integer'
		},
		selfmodFilterEnabled: {
			default: false,
			name: 'modules.moderation.selfmod.filter.enabled',
			type: 'boolean'
		},
		selfmodFilterHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.filter.hard-action',
			type: 'integer'
		},
		selfmodFilterHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.filter.hard-action-duration',
			type: 'timespan'
		},
		selfmodFilterIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.filter.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodFilterIgnoredRoles: {
			array: true,
			name: 'modules.moderation.selfmod.filter.ignored-roles',
			type: 'role'
		},
		selfmodFilterRaw: {
			array: true,
			dashboardOnly: true,
			name: 'modules.moderation.selfmod.filter.raw',
			type: 'string'
		},
		selfmodFilterSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.filter.soft-action',
			type: 'integer'
		},
		selfmodFilterThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.filter.threshold-duration',
			type: 'timespan'
		},
		selfmodFilterThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.moderation.selfmod.filter.threshold-maximum',
			type: 'integer'
		},
		selfmodIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodInvitesEnabled: {
			default: false,
			name: 'modules.moderation.selfmod.invites.enabled',
			type: 'boolean'
		},
		selfmodInvitesHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.invites.hard-action',
			type: 'integer'
		},
		selfmodInvitesHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.invites.hard-action-duration',
			type: 'timespan'
		},
		selfmodInvitesIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.invites.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodInvitesIgnoredCodes: {
			array: true,
			name: 'modules.moderation.selfmod.invites.ignored-codes',
			type: 'string'
		},
		selfmodInvitesIgnoredGuilds: {
			array: true,
			name: 'modules.moderation.selfmod.invites.ignored-guilds',
			type: 'string'
		},
		selfmodInvitesIgnoredRoles: {
			array: true,
			name: 'modules.moderation.selfmod.invites.ignored-roles',
			type: 'role'
		},
		selfmodInvitesSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.invites.soft-action',
			type: 'integer'
		},
		selfmodInvitesThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.invites.threshold-duration',
			type: 'timespan'
		},
		selfmodInvitesThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.moderation.selfmod.invites.threshold-maximum',
			type: 'integer'
		},
		selfmodLinksAllowed: {
			array: true,
			name: 'modules.moderation.selfmod.links.allowed',
			type: 'string'
		},
		selfmodLinksEnabled: {
			default: false,
			name: 'modules.moderation.selfmod.links.enabled',
			type: 'boolean'
		},
		selfmodLinksHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.links.hard-action',
			type: 'integer'
		},
		selfmodLinksHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.links.hard-action-duration',
			type: 'timespan'
		},
		selfmodLinksIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.links.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodLinksIgnoredRoles: {
			array: true,
			name: 'modules.moderation.selfmod.links.ignored-roles',
			type: 'role'
		},
		selfmodLinksSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.links.soft-action',
			type: 'integer'
		},
		selfmodLinksThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.links.threshold-duration',
			type: 'timespan'
		},
		selfmodLinksThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.moderation.selfmod.links.threshold-maximum',
			type: 'integer'
		},
		selfmodMessagesEnabled: {
			default: false,
			name: 'modules.moderation.selfmod.messages.enabled',
			type: 'boolean'
		},
		selfmodMessagesHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.messages.hard-action',
			type: 'integer'
		},
		selfmodMessagesHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.messages.hard-action-duration',
			type: 'timespan'
		},
		selfmodMessagesIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.messages.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodMessagesIgnoredRoles: {
			array: true,
			name: 'modules.moderation.selfmod.messages.ignored-roles',
			type: 'role'
		},
		selfmodMessagesMaximum: {
			default: 5,
			maximum: 100,
			minimum: 2,
			name: 'modules.moderation.selfmod.messages.maximum',
			type: 'integer'
		},
		selfmodMessagesQueueSize: {
			default: 50,
			maximum: 100,
			minimum: 10,
			name: 'modules.moderation.selfmod.messages.queue-size',
			type: 'integer'
		},
		selfmodMessagesSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.messages.soft-action',
			type: 'integer'
		},
		selfmodMessagesThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.messages.threshold-duration',
			type: 'timespan'
		},
		selfmodMessagesThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.moderation.selfmod.messages.threshold-maximum',
			type: 'integer'
		},
		selfmodNewlinesEnabled: {
			default: false,
			name: 'modules.moderation.selfmod.newlines.enabled',
			type: 'boolean'
		},
		selfmodNewlinesHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.newlines.hard-action',
			type: 'integer'
		},
		selfmodNewlinesHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.newlines.hard-action-duration',
			type: 'timespan'
		},
		selfmodNewlinesIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.newlines.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodNewlinesIgnoredRoles: {
			array: true,
			name: 'modules.moderation.selfmod.newlines.ignored-roles',
			type: 'role'
		},
		selfmodNewlinesMaximum: {
			default: 20,
			maximum: 100,
			minimum: 10,
			name: 'modules.moderation.selfmod.newlines.maximum',
			type: 'integer'
		},
		selfmodNewlinesSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.newlines.soft-action',
			type: 'integer'
		},
		selfmodNewlinesThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.newlines.threshold-duration',
			type: 'timespan'
		},
		selfmodNewlinesThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.moderation.selfmod.newlines.threshold-maximum',
			type: 'integer'
		},
		selfmodReactionsAllowed: {
			array: true,
			name: 'modules.moderation.selfmod.reactions.allowed',
			type: 'emoji'
		},
		selfmodReactionsBlocked: {
			array: true,
			name: 'modules.moderation.selfmod.reactions.blocked',
			type: 'emoji'
		},
		selfmodReactionsEnabled: {
			default: false,
			name: 'modules.moderation.selfmod.reactions.enabled',
			type: 'boolean'
		},
		selfmodReactionsHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.reactions.hard-action',
			type: 'integer'
		},
		selfmodReactionsHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.reactions.hard-action-duration',
			type: 'timespan'
		},
		selfmodReactionsIgnoredChannels: {
			array: true,
			name: 'modules.moderation.selfmod.reactions.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodReactionsIgnoredRoles: {
			array: true,
			name: 'modules.moderation.selfmod.reactions.ignored-roles',
			type: 'role'
		},
		selfmodReactionsMaximum: {
			default: 10,
			maximum: 100,
			minimum: 1,
			name: 'modules.moderation.selfmod.reactions.maximum',
			type: 'integer'
		},
		selfmodReactionsSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.moderation.selfmod.reactions.soft-action',
			type: 'integer'
		},
		selfmodReactionsThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.moderation.selfmod.reactions.threshold-duration',
			type: 'timespan'
		},
		selfmodReactionsThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.moderation.selfmod.reactions.threshold-maximum',
			type: 'integer'
		},
		starboardChannelId: {
			name: 'modules.starboard.channel',
			type: 'guildTextChannel'
		},
		starboardIgnoredChannels: {
			array: true,
			name: 'modules.starboard.ignored-channels',
			type: 'guildTextChannel'
		},
		starboardMinimum: {
			name: 'modules.starboard.minimum',
			type: 'number'
		},
		starboardSelfStar: {
			name: 'modules.starboard.self-star',
			type: 'boolean'
		},
		suggestionsAutoThread: {
			default: true,
			name: 'modules.suggestions.auto-thread',
			type: 'boolean'
		},
		suggestionsButtons: {
			default: false,
			name: 'modules.suggestions.buttons',
			type: 'boolean'
		},
		suggestionsChannel: {
			name: 'modules.suggestions.channel',
			type: 'sendableChannel'
		},
		suggestionsEmbed: {
			default: true,
			name: 'modules.suggestions.embed',
			type: 'boolean'
		},
		suggestionsUpdateHistory: {
			default: true,
			name: 'modules.suggestions.update-history',
			type: 'boolean'
		}
	});

	return cachedConfiguration;
}

function makeKey(property: SchemaDataKey, options: ConfigurableKeyOptions) {
	const name = options.name ?? property;
	const parts = name.split('.') as NonEmptyArray<string>;

	const value = new SchemaKey({
		...options,
		array: options.array ?? false,
		dashboardOnly: options.dashboardOnly ?? false,
		default: options.default ?? (options.array ? [] : options.type === 'boolean' ? false : null),
		inclusive: options.inclusive ?? true,
		key: parts.at(-1)!,
		maximum: options.maximum ?? null,
		minimum: options.minimum ?? null,
		name,
		property
	});

	configurableKeys.set(property, value);
	value.parent = configurableGroups.add(value.name.split('.') as NonEmptyArray<string>, value);

	return value;
}

function makeKeys(record: Record<SchemaDataKey, ConfigurableKeyOptions>): Record<SchemaDataKey, SchemaKey> {
	const entries = objectEntries(record)
		.filter(([, value]) => !value.dashboardOnly)
		.map(([key, value]) => [key, makeKey(key, value)] as const);
	return Object.fromEntries(entries) as Record<SchemaDataKey, SchemaKey>;
}

export const stringConfigurableKeys = () => getConfigurableKeys().map((key) => key.name);

export const stringConfigurableKeyGroupChoices: () => APIApplicationCommandOptionChoice<string>[] = () =>
	[
		...stringConfigurableKeys(),
		...[
			'modules',
			'modules.permissions',
			'modules.birthday',
			'modules.moderation.selfmod',
			'modules.moderation.selfmod.attachments',
			'modules.moderation.selfmod.capitals',
			'modules.moderation.selfmod.links',
			'modules.moderation.selfmod.messages',
			'modules.moderation.selfmod.newlines',
			'modules.moderation.selfmod.invites',
			'modules.moderation.selfmod.filter',
			'modules.moderation.selfmod.reactions',
			'modules.starboard',
			'channels',
			'channels.logs',
			'channels.ignore',
			'events',
			'messages',
			'messages.auto-delete',
			'roles'
		]
	]
		.sort((a, b) => a.localeCompare(b))
		.map((k) => ({ name: k, value: k }));

interface ConfigurableKeyOptions
	extends Omit<
			ConfigurableKeyValueOptions,
			'array' | 'dashboardOnly' | 'default' | 'inclusive' | 'key' | 'maximum' | 'minimum' | 'name' | 'property'
		>,
		Partial<Pick<ConfigurableKeyValueOptions, 'array' | 'dashboardOnly' | 'default' | 'inclusive' | 'maximum' | 'minimum' | 'name'>> {}
