import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container, LogLevel } from '@sapphire/framework';
import { I18nextFormatter, InternationalizationOptions } from '@sapphire/plugin-i18next';
import { cast } from '@sapphire/utilities';
import { envParseArray, envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import { getHandler } from '#languages';
import { SettingsKeys } from '#lib/database';
import { readSettings } from '#lib/database/settings/functions';
import { LanguageKeys, SupportedLanguages } from '#lib/i18n';
import { CustomGet, EnvKeys } from '#lib/types';
import { BotIds, Emojis, emojis, LanguageFormatters, rootFolder, Urls } from '#utils/constants';
import { FoxxiePaginatedMessageEmbedFields } from '#utils/external/FoxxiePaginatedMessageEmbedFields';
import {
	ActivitiesOptions,
	ActivityType,
	bold,
	channelMention,
	ClientOptions,
	codeBlock,
	GatewayIntentBits,
	GuildExplicitContentFilter,
	GuildVerificationLevel,
	inlineCode,
	italic,
	LocaleString,
	Partials,
	PermissionsString,
	PresenceUpdateStatus,
	time,
	TimestampStyles,
	User,
	userMention,
	WebhookClientData
} from 'discord.js';
import { getFixedT, InterpolationOptions } from 'i18next';
import { join } from 'path';

setup(join(rootFolder, '.env'));

export const formatDuration = (value: Date) => time(value, TimestampStyles.RelativeTime);
export const formatLongDate = (value: Date) => time(value, TimestampStyles.LongDate);

export const defaultPaginationOptions = [
	PaginatedMessage.defaultActions[1], // first
	PaginatedMessage.defaultActions[2], // previous
	PaginatedMessage.defaultActions[5], // stop
	PaginatedMessage.defaultActions[3], // next
	PaginatedMessage.defaultActions[4], // last
	PaginatedMessage.defaultActions[0]
];

export const defaultPaginationOptionsWithoutSelectMenu = [
	PaginatedMessage.defaultActions[1], // first
	PaginatedMessage.defaultActions[2], // previous
	PaginatedMessage.defaultActions[5], // stop
	PaginatedMessage.defaultActions[3], // next
	PaginatedMessage.defaultActions[4] // last
];

FoxxiePaginatedMessageEmbedFields.defaultActions = defaultPaginationOptions;
PaginatedMessage.defaultActions = defaultPaginationOptions;

export const clientOwners = envParseArray('CLIENT_OWNERS');
export const webhookError = parseWebhookError();
export const timezone = envParseString(EnvKeys.Timezone);

export function parsePresenceActivity(): ActivitiesOptions[] {
	const { CLIENT_PRESENCE_NAME } = process.env;
	if (!CLIENT_PRESENCE_NAME) return [];

	return [
		{
			name: envParseString('CLIENT_PRESENCE_NAME'),
			type: ActivityType.Playing
		}
	];
}

function getDurationValue(value: Date | number | string) {
	if (value instanceof Date) {
		return value;
	} else if (typeof value === 'string') {
		const timestamp = new Date(value);
		return timestamp;
	}

	return new Date(value);
}

function parseInternationalizationDefaultVariables() {
	return {
		APPROVED: emojis.perms.granted,
		CLIENT_ID: process.env.CLIENT_ID!,
		ERROR: Emojis.Error,
		LOADING: Emojis.Loading,
		MUSIC: Emojis.Music,
		SUCCESS: Emojis.Success,
		SUPPORT: Urls.Support,
		TCS: Urls.TheCornerStore,
		UNSPECIFIED: emojis.perms.notSpecified
	};
}

function parseInternationalizationFormatters(): I18nextFormatter[] {
	return [
		{
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value),
			name: LanguageFormatters.And
		},
		{
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value.map((item: string) => inlineCode(item))),
			name: LanguageFormatters.CodeAnd
		},
		{
			format: (value) => inlineCode(value),
			name: LanguageFormatters.Code
		},
		{
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'disjunction' }).format(value),
			name: 'or'
		},
		{
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'disjunction' }).format(value.map((item: string) => inlineCode(item))),
			name: 'codeor'
		},
		{
			format: (value) => formatDuration(getDurationValue(value)),
			name: LanguageFormatters.Duration
		},
		{
			format: (value) => time(getDurationValue(value), TimestampStyles.LongDate),
			name: LanguageFormatters.FullDate
		},
		{
			format: (value) => codeBlock('', value),
			name: LanguageFormatters.CodeBlock
		},
		{
			format: (value, lng) =>
				new Intl.DateTimeFormat(lng, {
					dateStyle: 'short',
					timeStyle: 'medium',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value),
			name: LanguageFormatters.DateTime
		},
		{
			format: (value: User) => (container.client.users.cache.has(value.id) ? userMention(value.id) : value.username),
			name: LanguageFormatters.UserMention
		},
		{
			format: (value: string) => channelMention(value),
			name: LanguageFormatters.ChannelMention
		},
		{
			format: (value, lng) =>
				new Intl.DateTimeFormat(lng, {
					timeStyle: 'short',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value),
			name: LanguageFormatters.Time
		},
		{
			format: (value, lng) =>
				new Intl.NumberFormat(lng, {
					compactDisplay: 'short',
					maximumFractionDigits: 2,
					notation: 'compact'
				}).format(value),
			name: LanguageFormatters.NumberCompact
		},
		{
			format: (value: GuildVerificationLevel, lng) => {
				const t = getFixedT(lng!);
				let key: CustomGet<string, string>;

				switch (value) {
					case GuildVerificationLevel.High:
						key = LanguageKeys.Guilds.VerificationLevels.High;
						break;
					case GuildVerificationLevel.Low:
						key = LanguageKeys.Guilds.VerificationLevels.Low;
						break;
					case GuildVerificationLevel.Medium:
						key = LanguageKeys.Guilds.VerificationLevels.Medium;
						break;
					case GuildVerificationLevel.None:
						key = LanguageKeys.Guilds.VerificationLevels.None;
						break;
					case GuildVerificationLevel.VeryHigh:
						key = LanguageKeys.Guilds.VerificationLevels.VeryHigh;
						break;
					default:
						key = LanguageKeys.Guilds.VerificationLevels.None;
				}

				return t(key);
			},
			name: LanguageFormatters.VerificationLevel
		},
		{
			format: (value) => formatDuration(getDurationValue(Date.now() + value)),
			name: LanguageFormatters.Remaining
		},
		{
			format: (value, lng) =>
				new Intl.DateTimeFormat(lng, {
					dateStyle: 'short',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value),
			name: 'dateshort'
		},
		{
			format: (value, lng) => {
				const date = new Intl.DateTimeFormat(lng, {
					dateStyle: 'long',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value);
				const time = new Intl.DateTimeFormat(lng, {
					hour: 'numeric',
					minute: 'numeric',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value);

				return `${date} ${time}`;
			},
			name: 'fulldatetime'
		},
		{
			format: (value) => formatLongDate(getDurationValue(value)),
			name: 'dateFormat'
		},
		{
			format: (value, lng) => getHandler(lng as LocaleString).ordinal(value),
			name: 'ordinal'
		},
		{
			format: (value) => bold(value),
			name: LanguageFormatters.Bold
		},
		{
			format: (value: PermissionsString[], lng) => {
				const t = getFixedT(lng!);
				return t(LanguageKeys.Globals.And, { value: value.map((v) => t(permissionStringToKey(v))).map(bold) });
			},
			name: LanguageFormatters.PermissionsArray
		},
		{
			format: (value: GuildExplicitContentFilter, lng) => {
				const t = getFixedT(lng!);
				let key: CustomGet<string, string>;

				console.log(value);

				switch (value) {
					case GuildExplicitContentFilter.AllMembers:
						key = LanguageKeys.Guilds.ContentFilters.AllMembers;
						break;
					case GuildExplicitContentFilter.MembersWithoutRoles:
						key = LanguageKeys.Guilds.ContentFilters.MembersWithoutRoles;
						break;
					case GuildExplicitContentFilter.Disabled:
						key = LanguageKeys.Guilds.ContentFilters.Disabled;
				}

				console.log(key);

				return t(key);
			},
			name: LanguageFormatters.ExplicitContentFilter
		},
		{
			format: (value, lng, options) => {
				const formatter = getHandler((lng ?? 'es-419') as LocaleString).duration;
				const precision = (options?.precision as number) ?? 2;
				return formatter.format(value, precision);
			},
			name: LanguageFormatters.DurationString
		},
		{
			format: (value) => italic(value),
			name: LanguageFormatters.Italic
		}
	];
}

function parseInternationalizationInterpolation(): InterpolationOptions {
	return {
		defaultVariables: parseInternationalizationDefaultVariables(),
		escapeValue: false
	};
}

function parseRegexPrefix(): RegExp {
	const str = process.env.CLIENT_REGEX_PREFIX!;
	return new RegExp(str, 'i');
}

function parseWebhookError(): null | WebhookClientData {
	const { WEBHOOK_ERROR_TOKEN } = process.env;
	if (!WEBHOOK_ERROR_TOKEN) return null;

	return {
		id: process.env.WEBHOOK_ERROR_ID!,
		token: WEBHOOK_ERROR_TOKEN
	};
}

function permissionStringToKey(permission: PermissionsString) {
	return LanguageKeys.Guilds.Permissions[permission];
}

export const PROJECT_ROOT = join(rootFolder, process.env.OVERRIDE_ROOT_PATH ?? 'dist');
export const LANGUAGE_ROOT = join(PROJECT_ROOT, 'languages');

function parseI18nOptions(): InternationalizationOptions {
	return {
		defaultLanguageDirectory: LANGUAGE_ROOT,
		defaultMissingKey: 'default',
		defaultNS: 'globals',
		fetchLanguage: async ({ guild }) => {
			if (!guild) return SupportedLanguages.EnglishUnitedStates;
			return readSettings(guild, SettingsKeys.Language);
		},
		formatters: parseInternationalizationFormatters(),
		i18next: (_: string[], languages: string[]) => ({
			debug: false,
			defaultNS: 'globals',
			fallbackLng: {
				default: [SupportedLanguages.EnglishUnitedStates],
				[SupportedLanguages.SpanishLatinAmerica]: ['es-ES', SupportedLanguages.EnglishUnitedStates] // Latin America Spanish falls back to Spain Spanish
			},
			initImmediate: false,
			interpolation: parseInternationalizationInterpolation(),
			lng: SupportedLanguages.EnglishUnitedStates,
			load: 'all',
			overloadTranslationOptionHandler: (args: string[]) => ({ defaultValue: args[1] ?? LanguageKeys.Globals.DefaultT }),
			preload: languages,
			returnEmptyString: false,
			returnNull: false,
			returnObjects: true,
			supportedLngs: languages
		})
	};
}

export const clientOptions: ClientOptions = {
	allowedMentions: { parse: ['users'] },
	audio: {
		hosts: {
			rest: `http://${envParseString('LAVALINK_URL')}`,
			ws: {
				options: {
					resumeKey: 'FOXXIE_RESUME_KEY',
					resumeTimeout: 120
				},
				url: `ws://${envParseString('LAVALINK_URL')}`
			}
		},
		password: envParseString('LAVALINK_PASSWORD'),
		shardCount: 0,
		userID: envParseString(EnvKeys.ClientId)
	},
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultPrefix: envParseString(EnvKeys.ClientPrefix),
	i18n: parseI18nOptions(),
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences
	],
	loadDefaultErrorListeners: false,
	loadMessageCommandListeners: true,
	logger: {
		level: cast<LogLevel>(envParseInteger(EnvKeys.LogLevel))
	},
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
	presence: {
		activities: parsePresenceActivity(),
		status: envParseString(EnvKeys.ClientId) === BotIds.Foxxie ? PresenceUpdateStatus.Idle : PresenceUpdateStatus.Invisible
	},
	regexPrefix: parseRegexPrefix(),
	shards: 'auto'
};
