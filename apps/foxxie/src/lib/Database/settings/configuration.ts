import { objectEntries } from '@sapphire/utilities';
import { ConfigurableKeyValueOptions, type GuildDataKey, NonEmptyArray, SchemaKey } from '#lib/database';
import { SchemaGroup } from '#lib/Database/settings/schema/SchemaGroup';
import { LanguageKeys } from '#lib/i18n';
import { years } from '#utils/common';
import { APIApplicationCommandOptionChoice, Collection } from 'discord.js';

export type SchemaDataKey = Exclude<GuildDataKey, 'id' | 'messageCount' | 'starboardEmojis' | 'tags' | 'words'>;

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
		channelsBirthday: {
			name: 'modules.birthday.channel',
			type: 'guildTextChannel'
		},
		channelsIgnoreAll: {
			array: true,
			name: 'channels.ignore.all',
			type: 'guildTextChannel'
		},
		channelsIgnoreMessageDelete: {
			array: true,
			name: 'channels.ignore.message-delete',
			type: 'guildTextChannel'
		},
		channelsIgnoreMessageEdit: {
			array: true,
			name: 'channels.ignore.message-edit',
			type: 'guildTextChannel'
		},
		channelsIgnoreReactionAdd: {
			array: true,
			name: 'channels.ignore.reaction-add',
			type: 'guildTextChannel'
		},
		channelsLogsChannelCreate: {
			name: 'channels.logs.channel-create',
			type: 'guildTextChannel'
		},
		channelsLogsChannelDelete: {
			name: 'channels.logs.channel-delete',
			type: 'guildTextChannel'
		},
		channelsLogsChannelUpdate: {
			name: 'channels.logs.channel-update',
			type: 'guildTextChannel'
		},
		channelsLogsEmojiCreate: {
			name: 'channels.logs.emoji-create',
			type: 'guildTextChannel'
		},
		channelsLogsEmojiDelete: {
			name: 'channels.logs.emoji-delete',
			type: 'guildTextChannel'
		},
		channelsLogsEmojiUpdate: {
			name: 'channels.logs.emoji-update',
			type: 'guildTextChannel'
		},
		channelsLogsImage: {
			name: 'channels.logs.image',
			type: 'guildTextChannel'
		},
		channelsLogsMemberAdd: {
			name: 'channels.logs.member-add',
			type: 'guildTextChannel'
		},
		channelsLogsMemberNicknameUpdate: {
			name: 'channels.logs.member-nickname-update',
			type: 'guildTextChannel'
		},
		channelsLogsMemberRemove: {
			name: 'channels.logs.member-remove',
			type: 'guildTextChannel'
		},
		channelsLogsMemberRolesUpdate: {
			name: 'channels.logs.member-roles-update',
			type: 'guildTextChannel'
		},
		channelsLogsMemberUsernameUpdate: {
			name: 'channels.logs.member-username-update',
			type: 'guildTextChannel'
		},
		channelsLogsMessageDelete: {
			name: 'channels.logs.message-delete',
			type: 'guildTextChannel'
		},
		channelsLogsMessageDeleteNsfw: {
			name: 'channels.logs.message-delete-nsfw',
			type: 'guildTextChannel'
		},
		channelsLogsMessageUpdate: {
			name: 'channels.logs.message-update',
			type: 'guildTextChannel'
		},
		channelsLogsMessageUpdateNsfw: {
			name: 'channels.logs.message-update-nsfw',
			type: 'guildTextChannel'
		},
		channelsLogsModeration: {
			name: 'channels.logs.moderation',
			type: 'guildTextChannel'
		},
		channelsLogsPrune: {
			name: 'channels.logs.prune',
			type: 'guildTextChannel'
		},
		channelsLogsReaction: {
			name: 'channels.logs.reaction',
			type: 'guildTextChannel'
		},
		channelsLogsRoleCreate: {
			name: 'channels.logs.role-create',
			type: 'guildTextChannel'
		},
		channelsLogsRoleDelete: {
			name: 'channels.logs.role-delete',
			type: 'guildTextChannel'
		},
		channelsLogsRoleUpdate: {
			name: 'channels.logs.role-update',
			type: 'guildTextChannel'
		},
		channelsLogsServerUpdate: {
			name: 'channels.logs.server-update',
			type: 'guildTextChannel'
		},
		channelsLogsVoiceActivity: {
			name: 'channels.logs.voice-activity',
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

		disabledCommandsChannels: {
			array: true,
			dashboardOnly: true,
			name: 'disabled-commands-channels',
			type: 'notAllowed'
		},

		disableNaturalPrefix: {
			default: false,
			name: 'disable-natural-prefix',
			type: 'boolean'
		},

		eventsBanAdd: {
			description: LanguageKeys.Settings.EventsBanAdd,
			name: 'events.ban-add',
			type: 'boolean'
		},
		eventsBanRemove: {
			description: LanguageKeys.Settings.EventsBanRemove,
			name: 'events.ban-remove',
			type: 'boolean'
		},
		eventsKick: {
			description: LanguageKeys.Settings.EventsKick,
			name: 'events.kick',
			type: 'boolean'
		},
		eventsMuteAdd: {
			description: LanguageKeys.Settings.EventsMuteAdd,
			name: 'events.mute-add',
			type: 'boolean'
		},
		eventsMuteRemove: {
			description: LanguageKeys.Settings.EventsMuteRemove,
			name: 'events.mute-remove',
			type: 'boolean'
		},
		highlights: {
			dashboardOnly: true,
			name: 'highlights',
			type: 'notAllowed'
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
			name: 'messages.moderation-auto-delete',
			type: 'boolean'
		},
		messagesModerationDm: {
			description: LanguageKeys.Settings.ModerationDm,
			name: 'messages.moderation-dm',
			type: 'boolean'
		},
		messagesModerationMessageDisplay: {
			default: true,
			name: 'messages.moderation-message-display',
			type: 'boolean'
		},
		messagesModerationReasonDisplay: {
			default: true,
			name: 'messages.moderation-reason-display',
			type: 'boolean'
		},
		messagesModeratorNameDisplay: {
			default: true,
			name: 'messages.moderator-name-display',
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
		reactionRoles: {
			array: true,
			dashboardOnly: true,
			name: 'roles.reaction-roles',
			type: 'notAllowed'
		},
		rolesAdmin: {
			array: true,
			name: 'roles.admin',
			type: 'role'
		},
		rolesBirthday: {
			name: 'modules.birthday.role',
			type: 'role'
		},
		rolesInitialBots: {
			array: true,
			description: LanguageKeys.Settings.Botroles,
			name: 'roles.initial-bots',
			type: 'role'
		},
		rolesInitialHumans: {
			array: true,
			description: LanguageKeys.Settings.Autoroles,
			name: 'roles.initial-humans',
			type: 'role'
		},
		rolesModerator: {
			array: true,
			name: 'roles.moderator',
			type: 'role'
		},
		rolesMuted: {
			description: LanguageKeys.Settings.RolesMuted,
			name: 'roles.muted',
			type: 'role'
		},
		rolesPersist: {
			array: true,
			dashboardOnly: true,
			name: 'modules.persist-roles',
			type: 'notAllowed'
		},
		rolesPersistEnabled: {
			description: LanguageKeys.Settings.RolesPersistEnabled,
			name: 'roles.persist-roles-enabled',
			type: 'boolean'
		},
		rolesRestrictedAttachment: {
			name: 'roles.restricted-attachment',
			type: 'role'
		},
		rolesRestrictedEmbed: {
			description: LanguageKeys.Settings.RolesEmbedRestrict,
			name: 'roles.restricted-embed',
			type: 'role'
		},
		rolesRestrictedEmoji: {
			name: 'roles.restricted-emoji',
			type: 'role'
		},
		rolesRestrictedReaction: {
			name: 'roles.restricted-reaction',
			type: 'role'
		},
		rolesRestrictedVoice: {
			name: 'roles.restricted-voice',
			type: 'role'
		},
		selfmodAttachmentsEnabled: {
			default: false,
			name: 'modules.selfmod.attachments.enabled',
			type: 'boolean'
		},
		selfmodAttachmentsHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.attachments.hard-action',
			type: 'integer'
		},
		selfmodAttachmentsHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.attachments.hard-action-duration',
			type: 'timespan'
		},
		selfmodAttachmentsIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.attachments.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodAttachmentsIgnoredRoles: {
			array: true,
			name: 'modules.selfmod.attachments.ignored-roles',
			type: 'role'
		},
		selfmodAttachmentsSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.attachments.soft-action',
			type: 'integer'
		},
		selfmodAttachmentsThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.attachments.threshold-duration',
			type: 'timespan'
		},
		selfmodAttachmentsThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.selfmod.attachments.threshold-maximum',
			type: 'integer'
		},
		selfmodCapitalsEnabled: {
			default: false,
			name: 'modules.selfmod.capitals.enabled',
			type: 'boolean'
		},
		selfmodCapitalsHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.capitals.hard-action',
			type: 'integer'
		},
		selfmodCapitalsHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.capitals.hard-action-duration',
			type: 'timespan'
		},
		selfmodCapitalsIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.capitals.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodCapitalsIgnoredRoles: {
			array: true,
			name: 'modules.selfmod.capitals.ignored-roles',
			type: 'role'
		},
		selfmodCapitalsMaximum: {
			default: 50,
			maximum: 100,
			minimum: 10,
			name: 'modules.selfmod.capitals.maximum',
			type: 'integer'
		},
		selfmodCapitalsMinimum: {
			default: 15,
			maximum: 2000,
			minimum: 5,
			name: 'modules.selfmod.capitals.minimum',
			type: 'integer'
		},
		selfmodCapitalsSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.capitals.soft-action',
			type: 'integer'
		},
		selfmodCapitalsThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.capitals.threshold-duration',
			type: 'timespan'
		},
		selfmodCapitalsThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.selfmod.capitals.threshold-maximum',
			type: 'integer'
		},
		selfmodFilterEnabled: {
			default: false,
			name: 'modules.selfmod.filter.enabled',
			type: 'boolean'
		},
		selfmodFilterHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.filter.hard-action',
			type: 'integer'
		},
		selfmodFilterHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.filter.hard-action-duration',
			type: 'timespan'
		},
		selfmodFilterIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.filter.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodFilterIgnoredRoles: {
			array: true,
			name: 'modules.selfmod.filter.ignored-roles',
			type: 'role'
		},
		selfmodFilterRaw: {
			array: true,
			dashboardOnly: true,
			name: 'modules.selfmod.filter.raw',
			type: 'string'
		},
		selfmodFilterSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.filter.soft-action',
			type: 'integer'
		},
		selfmodFilterThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.filter.threshold-duration',
			type: 'timespan'
		},
		selfmodFilterThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.selfmod.filter.threshold-maximum',
			type: 'integer'
		},
		selfmodIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodInvitesEnabled: {
			default: false,
			name: 'modules.selfmod.invites.enabled',
			type: 'boolean'
		},
		selfmodInvitesHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.invites.hard-action',
			type: 'integer'
		},
		selfmodInvitesHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.invites.hard-action-duration',
			type: 'timespan'
		},
		selfmodInvitesIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.invites.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodInvitesIgnoredCodes: {
			array: true,
			name: 'modules.selfmod.invites.ignored-codes',
			type: 'string'
		},
		selfmodInvitesIgnoredGuilds: {
			array: true,
			name: 'modules.selfmod.invites.ignored-guilds',
			type: 'string'
		},
		selfmodInvitesIgnoredRoles: {
			array: true,
			name: 'modules.selfmod.invites.ignored-roles',
			type: 'role'
		},
		selfmodInvitesSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.invites.soft-action',
			type: 'integer'
		},
		selfmodInvitesThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.invites.threshold-duration',
			type: 'timespan'
		},
		selfmodInvitesThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.selfmod.invites.threshold-maximum',
			type: 'integer'
		},
		selfmodLinksAllowed: {
			array: true,
			name: 'modules.selfmod.links.allowed',
			type: 'string'
		},
		selfmodLinksEnabled: {
			default: false,
			name: 'modules.selfmod.links.enabled',
			type: 'boolean'
		},
		selfmodLinksHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.links.hard-action',
			type: 'integer'
		},
		selfmodLinksHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.links.hard-action-duration',
			type: 'timespan'
		},
		selfmodLinksIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.links.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodLinksIgnoredRoles: {
			array: true,
			name: 'modules.selfmod.links.ignored-roles',
			type: 'role'
		},
		selfmodLinksSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.links.soft-action',
			type: 'integer'
		},
		selfmodLinksThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.links.threshold-duration',
			type: 'timespan'
		},
		selfmodLinksThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.selfmod.links.threshold-maximum',
			type: 'integer'
		},
		selfmodMessagesEnabled: {
			default: false,
			name: 'modules.selfmod.messages.enabled',
			type: 'boolean'
		},
		selfmodMessagesHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.messages.hard-action',
			type: 'integer'
		},
		selfmodMessagesHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.messages.hard-action-duration',
			type: 'timespan'
		},
		selfmodMessagesIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.messages.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodMessagesIgnoredRoles: {
			array: true,
			name: 'modules.selfmod.messages.ignored-roles',
			type: 'role'
		},
		selfmodMessagesMaximum: {
			default: 5,
			maximum: 100,
			minimum: 2,
			name: 'modules.selfmod.messages.maximum',
			type: 'integer'
		},
		selfmodMessagesQueueSize: {
			default: 50,
			maximum: 100,
			minimum: 10,
			name: 'modules.selfmod.messages.queue-size',
			type: 'integer'
		},
		selfmodMessagesSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.messages.soft-action',
			type: 'integer'
		},
		selfmodMessagesThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.messages.threshold-duration',
			type: 'timespan'
		},
		selfmodMessagesThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.selfmod.messages.threshold-maximum',
			type: 'integer'
		},
		selfmodNewlinesEnabled: {
			default: false,
			name: 'modules.selfmod.newlines.enabled',
			type: 'boolean'
		},
		selfmodNewlinesHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.newlines.hard-action',
			type: 'integer'
		},
		selfmodNewlinesHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.newlines.hard-action-duration',
			type: 'timespan'
		},
		selfmodNewlinesIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.newlines.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodNewlinesIgnoredRoles: {
			array: true,
			name: 'modules.selfmod.newlines.ignored-roles',
			type: 'role'
		},
		selfmodNewlinesMaximum: {
			default: 20,
			maximum: 100,
			minimum: 10,
			name: 'modules.selfmod.newlines.maximum',
			type: 'integer'
		},
		selfmodNewlinesSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.newlines.soft-action',
			type: 'integer'
		},
		selfmodNewlinesThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.newlines.threshold-duration',
			type: 'timespan'
		},
		selfmodNewlinesThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.selfmod.newlines.threshold-maximum',
			type: 'integer'
		},
		selfmodReactionsAllowed: {
			array: true,
			name: 'modules.selfmod.reactions.allowed',
			type: 'emoji'
		},
		selfmodReactionsBlocked: {
			array: true,
			name: 'modules.selfmod.reactions.blocked',
			type: 'emoji'
		},
		selfmodReactionsEnabled: {
			default: false,
			name: 'modules.selfmod.reactions.enabled',
			type: 'boolean'
		},
		selfmodReactionsHardAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.reactions.hard-action',
			type: 'integer'
		},
		selfmodReactionsHardActionDuration: {
			dashboardOnly: true,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.reactions.hard-action-duration',
			type: 'timespan'
		},
		selfmodReactionsIgnoredChannels: {
			array: true,
			name: 'modules.selfmod.reactions.ignored-channels',
			type: 'guildTextChannel'
		},
		selfmodReactionsIgnoredRoles: {
			array: true,
			name: 'modules.selfmod.reactions.ignored-roles',
			type: 'role'
		},
		selfmodReactionsMaximum: {
			default: 10,
			maximum: 100,
			minimum: 1,
			name: 'modules.selfmod.reactions.maximum',
			type: 'integer'
		},
		selfmodReactionsSoftAction: {
			dashboardOnly: true,
			default: 0,
			name: 'modules.selfmod.reactions.soft-action',
			type: 'integer'
		},
		selfmodReactionsThresholdDuration: {
			dashboardOnly: true,
			default: 60000,
			maximum: years(5),
			minimum: 0,
			name: 'modules.selfmod.reactions.threshold-duration',
			type: 'timespan'
		},
		selfmodReactionsThresholdMaximum: {
			dashboardOnly: true,
			default: 10,
			maximum: 100,
			minimum: 0,
			name: 'modules.selfmod.reactions.threshold-maximum',
			type: 'integer'
		},
		starboardChannelId: {
			name: 'modules.starboard.channel',
			type: 'guildTextChannel'
		},
		starboardMinimum: {
			name: 'modules.starboard.minimum',
			type: 'number'
		},
		starboardSelfStar: {
			name: 'modules.starboard.self-star',
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
	const entries = objectEntries(record).map(([key, value]) => [key, makeKey(key, value)] as const);
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
			'modules.selfmod',
			'modules.selfmod.attachments',
			'modules.selfmod.capitals',
			'modules.selfmod.links',
			'modules.selfmod.messages',
			'modules.selfmod.newlines',
			'modules.selfmod.invites',
			'modules.selfmod.filter',
			'modules.selfmod.reactions',
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
