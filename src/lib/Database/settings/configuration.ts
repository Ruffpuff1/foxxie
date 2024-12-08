import { ConfigurableKeyValueOptions, NonEmptyArray, SchemaKey, type GuildDataKey } from '#lib/database';
import { SchemaGroup } from '#lib/Database/settings/schema/SchemaGroup';
import { LanguageKeys } from '#lib/i18n';
import { years } from '#utils/common';
import { objectEntries } from '@sapphire/utilities';
import { Collection } from 'discord.js';
import { EnvKeys } from '#lib/types';
import { envParseString } from '@skyra/env-utilities';

export type SchemaDataKey = Exclude<GuildDataKey, 'id' | 'messageCount' | 'starboardEmojis' | 'tags' | 'words'>;

const configurableKeys = new Collection<SchemaDataKey, SchemaKey>();
const configurableGroups = new SchemaGroup('::ROOT::');

export function getConfigurableKeys(): Collection<SchemaDataKey, SchemaKey> {
	getConfiguration();
	return configurableKeys;
}

export function getConfigurableGroups(): SchemaGroup {
	getConfiguration();
	return configurableGroups;
}

let cachedConfiguration: Record<SchemaDataKey, SchemaKey> | null = null;
export function getConfiguration() {
	cachedConfiguration ??= makeKeys({
		prefix: {
			type: 'string',
			description: LanguageKeys.Settings.Prefix,
			minimum: 1,
			maximum: 10,
			default: envParseString(EnvKeys.ClientPrefix)
		},
		language: {
			type: 'language',
			description: LanguageKeys.Settings.Language,
			default: 'en-US'
		},
		disableNaturalPrefix: {
			name: 'disable-natural-prefix',
			type: 'boolean',
			default: false
		},
		disabledCommands: {
			name: 'disabled-commands',
			type: 'commandMatch',
			description: LanguageKeys.Settings.DisabledCommands,
			maximum: 32,
			array: true
		},
		permissionsUsers: {
			type: 'permissionNode',
			name: 'modules.permissions.users',
			array: true,
			dashboardOnly: true
		},
		permissionsRoles: {
			type: 'permissionNode',
			name: 'modules.permissions.roles',
			array: true,
			dashboardOnly: true
		},
		channelsMediaOnly: {
			type: 'guildTextChannel',
			name: 'channels.media-only',
			array: true
		},
		channelsLogsModeration: {
			type: 'guildTextChannel',
			name: 'channels.logs.moderation'
		},
		channelsLogsImage: {
			type: 'guildTextChannel',
			name: 'channels.logs.image'
		},
		channelsLogsMemberAdd: {
			type: 'guildTextChannel',
			name: 'channels.logs.member-add'
		},
		channelsLogsMemberRemove: {
			type: 'guildTextChannel',
			name: 'channels.logs.member-remove'
		},
		channelsLogsMemberNicknameUpdate: {
			type: 'guildTextChannel',
			name: 'channels.logs.member-nickname-update'
		},
		channelsLogsMemberUsernameUpdate: {
			type: 'guildTextChannel',
			name: 'channels.logs.member-username-update'
		},
		channelsLogsMemberRolesUpdate: {
			type: 'guildTextChannel',
			name: 'channels.logs.member-roles-update'
		},
		channelsLogsMessageDelete: {
			type: 'guildTextChannel',
			name: 'channels.logs.message-delete'
		},
		channelsLogsMessageDeleteNsfw: {
			type: 'guildTextChannel',
			name: 'channels.logs.message-delete-nsfw'
		},
		channelsLogsMessageUpdate: {
			type: 'guildTextChannel',
			name: 'channels.logs.message-update'
		},
		channelsLogsMessageUpdateNsfw: {
			type: 'guildTextChannel',
			name: 'channels.logs.message-update-nsfw'
		},
		channelsLogsPrune: {
			type: 'guildTextChannel',
			name: 'channels.logs.prune'
		},
		channelsLogsReaction: {
			type: 'guildTextChannel',
			name: 'channels.logs.reaction'
		},
		channelsLogsRoleCreate: {
			type: 'guildTextChannel',
			name: 'channels.logs.role-create'
		},
		channelsLogsRoleUpdate: {
			type: 'guildTextChannel',
			name: 'channels.logs.role-update'
		},
		channelsLogsRoleDelete: {
			type: 'guildTextChannel',
			name: 'channels.logs.role-delete'
		},
		channelsLogsChannelCreate: {
			type: 'guildTextChannel',
			name: 'channels.logs.channel-create'
		},
		channelsLogsChannelUpdate: {
			type: 'guildTextChannel',
			name: 'channels.logs.channel-update'
		},
		channelsLogsChannelDelete: {
			type: 'guildTextChannel',
			name: 'channels.logs.channel-delete'
		},
		channelsLogsEmojiCreate: {
			type: 'guildTextChannel',
			name: 'channels.logs.emoji-create'
		},
		channelsLogsEmojiUpdate: {
			type: 'guildTextChannel',
			name: 'channels.logs.emoji-update'
		},
		channelsLogsEmojiDelete: {
			type: 'guildTextChannel',
			name: 'channels.logs.emoji-delete'
		},
		channelsLogsServerUpdate: {
			type: 'guildTextChannel',
			name: 'channels.logs.server-update'
		},
		channelsLogsVoiceActivity: {
			type: 'guildTextChannel',
			name: 'channels.logs.voice-activity'
		},
		channelsIgnoreAll: {
			type: 'guildTextChannel',
			name: 'channels.ignore.all',
			array: true
		},
		channelsIgnoreMessageEdit: {
			type: 'guildTextChannel',
			name: 'channels.ignore.message-edit',
			array: true
		},
		channelsIgnoreMessageDelete: {
			type: 'guildTextChannel',
			name: 'channels.ignore.message-delete',
			array: true
		},
		channelsIgnoreReactionAdd: {
			type: 'guildTextChannel',
			name: 'channels.ignore.reaction-add',
			array: true
		},
		disabledChannels: {
			type: 'guildTextChannel',
			name: 'disabled-channels',
			description: LanguageKeys.Settings.DisabledChannels,
			array: true
		},
		disabledCommandsChannels: {
			type: 'notAllowed',
			name: 'disabled-commands-channels',
			array: true,
			dashboardOnly: true
		},
		eventsBanAdd: {
			type: 'boolean',
			name: 'events.ban-add',
			description: LanguageKeys.Settings.EventsBanAdd
		},
		eventsBanRemove: {
			type: 'boolean',
			name: 'events.ban-remove',
			description: LanguageKeys.Settings.EventsBanRemove
		},
		eventsKick: {
			type: 'boolean',
			name: 'events.kick',
			description: LanguageKeys.Settings.EventsKick
		},
		eventsMuteAdd: {
			type: 'boolean',
			name: 'events.mute-add',
			description: LanguageKeys.Settings.EventsMuteAdd
		},
		eventsMuteRemove: {
			type: 'boolean',
			name: 'events.mute-remove',
			description: LanguageKeys.Settings.EventsMuteRemove
		},
		messagesIgnoreChannels: {
			type: 'guildTextChannel',
			name: 'messages.ignore-channels',
			array: true
		},
		messagesModerationDm: {
			type: 'boolean',
			name: 'messages.moderation-dm',
			description: LanguageKeys.Settings.ModerationDm
		},
		messagesModerationReasonDisplay: {
			type: 'boolean',
			name: 'messages.moderation-reason-display',
			default: true
		},
		messagesModerationMessageDisplay: {
			type: 'boolean',
			name: 'messages.moderation-message-display',
			default: true
		},
		messagesModerationAutoDelete: {
			type: 'boolean',
			name: 'messages.moderation-auto-delete',
			description: LanguageKeys.Settings.MessagesModerationAutoDelete,
			default: false
		},
		messagesModeratorNameDisplay: {
			type: 'boolean',
			name: 'messages.moderator-name-display',
			default: true
		},
		messagesAutoDeleteIgnoredAll: {
			type: 'boolean',
			name: 'messages.auto-delete.ignored-all',
			default: false
		},
		messagesAutoDeleteIgnoredRoles: {
			type: 'role',
			name: 'messages.auto-delete.ignored-roles',
			array: true
		},
		messagesAutoDeleteIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'messages.auto-delete.ignored-channels',
			array: true
		},
		messagesAutoDeleteIgnoredCommands: {
			type: 'commandMatch',
			name: 'messages.auto-delete.ignored-commands',
			array: true
		},
		rolesPersist: {
			type: 'notAllowed',
			name: 'modules.persist-roles',
			array: true,
			dashboardOnly: true
		},
		rolesPersistEnabled: {
			type: 'boolean',
			name: 'roles.persist-roles-enabled',
			description: LanguageKeys.Settings.RolesPersistEnabled
		},
		reactionRoles: {
			type: 'notAllowed',
			name: 'roles.reaction-roles',
			array: true,
			dashboardOnly: true
		},
		rolesAdmin: {
			type: 'role',
			name: 'roles.admin',
			array: true
		},
		rolesInitialHumans: {
			type: 'role',
			array: true,
			name: 'roles.initial-humans',
			description: LanguageKeys.Settings.Autoroles
		},
		rolesInitialBots: {
			type: 'role',
			array: true,
			name: 'roles.initial-bots',
			description: LanguageKeys.Settings.Botroles
		},
		rolesModerator: {
			type: 'role',
			name: 'roles.moderator',
			array: true
		},
		rolesMuted: {
			type: 'role',
			name: 'roles.muted',
			description: LanguageKeys.Settings.RolesMuted
		},
		rolesRestrictedAttachment: {
			type: 'role',
			name: 'roles.restricted-attachment'
		},
		rolesRestrictedReaction: {
			type: 'role',
			name: 'roles.restricted-reaction'
		},
		rolesRestrictedEmbed: {
			type: 'role',
			name: 'roles.restricted-embed',
			description: LanguageKeys.Settings.RolesEmbedRestrict
		},
		rolesRestrictedEmoji: {
			type: 'role',
			name: 'roles.restricted-emoji'
		},
		rolesRestrictedVoice: {
			type: 'role',
			name: 'roles.restricted-voice'
		},
		rolesBirthday: {
			type: 'role',
			name: 'modules.birthday.role'
		},
		channelsBirthday: {
			type: 'guildTextChannel',
			name: 'modules.birthday.channel'
		},
		selfmodAttachmentsEnabled: {
			type: 'boolean',
			name: 'modules.selfmod.attachments.enabled',
			default: false
		},
		selfmodAttachmentsIgnoredRoles: {
			type: 'role',
			name: 'modules.selfmod.attachments.ignored-roles',
			array: true
		},
		selfmodAttachmentsIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.attachments.ignored-channels',
			array: true
		},
		selfmodAttachmentsSoftAction: {
			type: 'integer',
			name: 'modules.selfmod.attachments.soft-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodAttachmentsHardAction: {
			type: 'integer',
			name: 'modules.selfmod.attachments.hard-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodAttachmentsHardActionDuration: {
			type: 'timespan',
			name: 'modules.selfmod.attachments.hard-action-duration',
			minimum: 0,
			maximum: years(5),
			dashboardOnly: true
		},
		selfmodAttachmentsThresholdMaximum: {
			type: 'integer',
			name: 'modules.selfmod.attachments.threshold-maximum',
			minimum: 0,
			maximum: 100,
			default: 10,
			dashboardOnly: true
		},
		selfmodAttachmentsThresholdDuration: {
			type: 'timespan',
			name: 'modules.selfmod.attachments.threshold-duration',
			minimum: 0,
			maximum: years(5),
			default: 60000,
			dashboardOnly: true
		},
		selfmodCapitalsEnabled: {
			type: 'boolean',
			name: 'modules.selfmod.capitals.enabled',
			default: false
		},
		selfmodCapitalsIgnoredRoles: {
			type: 'role',
			name: 'modules.selfmod.capitals.ignored-roles',
			array: true
		},
		selfmodCapitalsIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.capitals.ignored-channels',
			array: true
		},
		selfmodCapitalsMinimum: {
			type: 'integer',
			name: 'modules.selfmod.capitals.minimum',
			minimum: 5,
			maximum: 2000,
			default: 15
		},
		selfmodCapitalsMaximum: {
			type: 'integer',
			name: 'modules.selfmod.capitals.maximum',
			minimum: 10,
			maximum: 100,
			default: 50
		},
		selfmodCapitalsSoftAction: {
			type: 'integer',
			name: 'modules.selfmod.capitals.soft-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodCapitalsHardAction: {
			type: 'integer',
			name: 'modules.selfmod.capitals.hard-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodCapitalsHardActionDuration: {
			type: 'timespan',
			name: 'modules.selfmod.capitals.hard-action-duration',
			minimum: 0,
			maximum: years(5),
			dashboardOnly: true
		},
		selfmodCapitalsThresholdMaximum: {
			type: 'integer',
			name: 'modules.selfmod.capitals.threshold-maximum',
			minimum: 0,
			maximum: 100,
			default: 10,
			dashboardOnly: true
		},
		selfmodCapitalsThresholdDuration: {
			type: 'timespan',
			name: 'modules.selfmod.capitals.threshold-duration',
			minimum: 0,
			maximum: years(5),
			default: 60000,
			dashboardOnly: true
		},
		selfmodLinksEnabled: {
			type: 'boolean',
			name: 'modules.selfmod.links.enabled',
			default: false
		},
		selfmodLinksAllowed: {
			type: 'string',
			name: 'modules.selfmod.links.allowed',
			array: true
		},
		selfmodLinksIgnoredRoles: {
			type: 'role',
			name: 'modules.selfmod.links.ignored-roles',
			array: true
		},
		selfmodLinksIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.links.ignored-channels',
			array: true
		},
		selfmodLinksSoftAction: {
			type: 'integer',
			name: 'modules.selfmod.links.soft-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodLinksHardAction: {
			type: 'integer',
			name: 'modules.selfmod.links.hard-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodLinksHardActionDuration: {
			type: 'timespan',
			name: 'modules.selfmod.links.hard-action-duration',
			minimum: 0,
			maximum: years(5),
			dashboardOnly: true
		},
		selfmodLinksThresholdMaximum: {
			type: 'integer',
			name: 'modules.selfmod.links.threshold-maximum',
			minimum: 0,
			maximum: 100,
			default: 10,
			dashboardOnly: true
		},
		selfmodLinksThresholdDuration: {
			type: 'timespan',
			name: 'modules.selfmod.links.threshold-duration',
			minimum: 0,
			maximum: years(5),
			default: 60000,
			dashboardOnly: true
		},
		selfmodMessagesEnabled: {
			type: 'boolean',
			name: 'modules.selfmod.messages.enabled',
			default: false
		},
		selfmodMessagesIgnoredRoles: {
			type: 'role',
			name: 'modules.selfmod.messages.ignored-roles',
			array: true
		},
		selfmodMessagesIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.messages.ignored-channels',
			array: true
		},
		selfmodMessagesMaximum: {
			type: 'integer',
			name: 'modules.selfmod.messages.maximum',
			minimum: 2,
			maximum: 100,
			default: 5
		},
		selfmodMessagesQueueSize: {
			type: 'integer',
			name: 'modules.selfmod.messages.queue-size',
			minimum: 10,
			maximum: 100,
			default: 50
		},
		selfmodMessagesSoftAction: {
			type: 'integer',
			name: 'modules.selfmod.messages.soft-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodMessagesHardAction: {
			type: 'integer',
			name: 'modules.selfmod.messages.hard-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodMessagesHardActionDuration: {
			type: 'timespan',
			name: 'modules.selfmod.messages.hard-action-duration',
			minimum: 0,
			maximum: years(5),
			dashboardOnly: true
		},
		selfmodMessagesThresholdMaximum: {
			type: 'integer',
			name: 'modules.selfmod.messages.threshold-maximum',
			minimum: 0,
			maximum: 100,
			default: 10,
			dashboardOnly: true
		},
		selfmodMessagesThresholdDuration: {
			type: 'timespan',
			name: 'modules.selfmod.messages.threshold-duration',
			minimum: 0,
			maximum: years(5),
			default: 60000,
			dashboardOnly: true
		},
		selfmodNewlinesEnabled: {
			type: 'boolean',
			name: 'modules.selfmod.newlines.enabled',
			default: false
		},
		selfmodNewlinesIgnoredRoles: {
			type: 'role',
			name: 'modules.selfmod.newlines.ignored-roles',
			array: true
		},
		selfmodNewlinesIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.newlines.ignored-channels',
			array: true
		},
		selfmodNewlinesMaximum: {
			type: 'integer',
			name: 'modules.selfmod.newlines.maximum',
			minimum: 10,
			maximum: 100,
			default: 20
		},
		selfmodNewlinesSoftAction: {
			type: 'integer',
			name: 'modules.selfmod.newlines.soft-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodNewlinesHardAction: {
			type: 'integer',
			name: 'modules.selfmod.newlines.hard-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodNewlinesHardActionDuration: {
			type: 'timespan',
			name: 'modules.selfmod.newlines.hard-action-duration',
			minimum: 0,
			maximum: years(5),
			dashboardOnly: true
		},
		selfmodNewlinesThresholdMaximum: {
			type: 'integer',
			name: 'modules.selfmod.newlines.threshold-maximum',
			minimum: 0,
			maximum: 100,
			default: 10,
			dashboardOnly: true
		},
		selfmodNewlinesThresholdDuration: {
			type: 'timespan',
			name: 'modules.selfmod.newlines.threshold-duration',
			minimum: 0,
			maximum: years(5),
			default: 60000,
			dashboardOnly: true
		},
		selfmodInvitesEnabled: {
			type: 'boolean',
			name: 'modules.selfmod.invites.enabled',
			default: false
		},
		selfmodInvitesIgnoredCodes: {
			type: 'string',
			name: 'modules.selfmod.invites.ignored-codes',
			array: true
		},
		selfmodInvitesIgnoredGuilds: {
			type: 'string',
			name: 'modules.selfmod.invites.ignored-guilds',
			array: true
		},
		selfmodInvitesIgnoredRoles: {
			type: 'role',
			name: 'modules.selfmod.invites.ignored-roles',
			array: true
		},
		selfmodInvitesIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.invites.ignored-channels',
			array: true
		},
		selfmodInvitesSoftAction: {
			type: 'integer',
			name: 'modules.selfmod.invites.soft-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodInvitesHardAction: {
			type: 'integer',
			name: 'modules.selfmod.invites.hard-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodInvitesHardActionDuration: {
			type: 'timespan',
			name: 'modules.selfmod.invites.hard-action-duration',
			minimum: 0,
			maximum: years(5),
			dashboardOnly: true
		},
		selfmodInvitesThresholdMaximum: {
			type: 'integer',
			name: 'modules.selfmod.invites.threshold-maximum',
			minimum: 0,
			maximum: 100,
			default: 10,
			dashboardOnly: true
		},
		selfmodInvitesThresholdDuration: {
			type: 'timespan',
			name: 'modules.selfmod.invites.threshold-duration',
			minimum: 0,
			maximum: years(5),
			default: 60000,
			dashboardOnly: true
		},
		selfmodFilterEnabled: {
			type: 'boolean',
			name: 'modules.selfmod.filter.enabled',
			default: false
		},
		selfmodFilterRaw: {
			type: 'string',
			name: 'modules.selfmod.filter.raw',
			array: true,
			dashboardOnly: true
		},
		selfmodFilterIgnoredRoles: {
			type: 'role',
			name: 'modules.selfmod.filter.ignored-roles',
			array: true
		},
		selfmodFilterIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.filter.ignored-channels',
			array: true
		},
		selfmodFilterSoftAction: {
			type: 'integer',
			name: 'modules.selfmod.filter.soft-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodFilterHardAction: {
			type: 'integer',
			name: 'modules.selfmod.filter.hard-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodFilterHardActionDuration: {
			type: 'timespan',
			name: 'modules.selfmod.filter.hard-action-duration',
			minimum: 0,
			maximum: years(5),
			dashboardOnly: true
		},
		selfmodFilterThresholdMaximum: {
			type: 'integer',
			name: 'modules.selfmod.filter.threshold-maximum',
			minimum: 0,
			maximum: 100,
			default: 10,
			dashboardOnly: true
		},
		selfmodFilterThresholdDuration: {
			type: 'timespan',
			name: 'modules.selfmod.filter.threshold-duration',
			minimum: 0,
			maximum: years(5),
			default: 60000,
			dashboardOnly: true
		},
		selfmodReactionsEnabled: {
			type: 'boolean',
			name: 'modules.selfmod.reactions.enabled',
			default: false
		},
		selfmodReactionsIgnoredRoles: {
			type: 'role',
			name: 'modules.selfmod.reactions.ignored-roles',
			array: true
		},
		selfmodReactionsIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.reactions.ignored-channels',
			array: true
		},
		selfmodReactionsMaximum: {
			type: 'integer',
			name: 'modules.selfmod.reactions.maximum',
			minimum: 1,
			maximum: 100,
			default: 10
		},
		selfmodReactionsAllowed: {
			type: 'emoji',
			name: 'modules.selfmod.reactions.allowed',
			array: true
		},
		selfmodReactionsBlocked: {
			type: 'emoji',
			name: 'modules.selfmod.reactions.blocked',
			array: true
		},
		selfmodReactionsSoftAction: {
			type: 'integer',
			name: 'modules.selfmod.reactions.soft-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodReactionsHardAction: {
			type: 'integer',
			name: 'modules.selfmod.reactions.hard-action',
			default: 0,
			dashboardOnly: true
		},
		selfmodReactionsHardActionDuration: {
			type: 'timespan',
			name: 'modules.selfmod.reactions.hard-action-duration',
			minimum: 0,
			maximum: years(5),
			dashboardOnly: true
		},
		selfmodReactionsThresholdMaximum: {
			type: 'integer',
			name: 'modules.selfmod.reactions.threshold-maximum',
			minimum: 0,
			maximum: 100,
			default: 10,
			dashboardOnly: true
		},
		selfmodReactionsThresholdDuration: {
			type: 'timespan',
			name: 'modules.selfmod.reactions.threshold-duration',
			minimum: 0,
			maximum: years(5),
			default: 60000,
			dashboardOnly: true
		},
		selfmodIgnoredChannels: {
			type: 'guildTextChannel',
			name: 'modules.selfmod.ignored-channels',
			array: true
		},
		starboardChannelId: {
			type: 'guildTextChannel',
			name: 'modules.starboard.channel'
		},
		starboardMinimum: {
			type: 'number',
			name: 'modules.starboard.minimum'
		},
		starboardSelfStar: {
			type: 'boolean',
			name: 'modules.starboard.self-star'
		}
	});

	return cachedConfiguration;
}

function makeKeys(record: Record<SchemaDataKey, ConfigurableKeyOptions>): Record<SchemaDataKey, SchemaKey> {
	const entries = objectEntries(record).map(([key, value]) => [key, makeKey(key, value)] as const);
	return Object.fromEntries(entries) as Record<SchemaDataKey, SchemaKey>;
}

function makeKey(property: SchemaDataKey, options: ConfigurableKeyOptions) {
	const name = options.name ?? property;
	const parts = name.split('.') as NonEmptyArray<string>;

	const value = new SchemaKey({
		...options,
		key: parts.at(-1)!,
		name,
		property,
		array: options.array ?? false,
		inclusive: options.inclusive ?? true,
		minimum: options.minimum ?? null,
		maximum: options.maximum ?? null,
		default: options.default ?? (options.array ? [] : options.type === 'boolean' ? false : null),
		dashboardOnly: options.dashboardOnly ?? false
	});

	configurableKeys.set(property, value);
	value.parent = configurableGroups.add(value.name.split('.') as NonEmptyArray<string>, value);

	return value;
}

interface ConfigurableKeyOptions
	extends Omit<
			ConfigurableKeyValueOptions,
			'key' | 'property' | 'name' | 'array' | 'inclusive' | 'minimum' | 'maximum' | 'default' | 'dashboardOnly'
		>,
		Partial<Pick<ConfigurableKeyValueOptions, 'name' | 'array' | 'inclusive' | 'minimum' | 'maximum' | 'default' | 'dashboardOnly'>> {}
