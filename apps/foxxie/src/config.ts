import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container, LogLevel } from '@sapphire/framework';
import { I18nextFormatter, InternationalizationOptions, TFunction } from '@sapphire/plugin-i18next';
import { cast, toTitleCase } from '@sapphire/utilities';
import { envParseArray, envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import { getHandler } from '#languages';
import { readSettings } from '#lib/Database/settings/functions';
import { LanguageKeys, SupportedLanguages } from '#lib/i18n';
import { CustomGet, EnvKeys } from '#lib/types';
import { Emojis, emojis, LanguageFormatters, rootFolder, Urls } from '#utils/constants';
import { FoxxiePaginatedMessageEmbedFields } from '#utils/External/FoxxiePaginatedMessageEmbedFields';
import {
	ActivitiesOptions,
	ActivityType,
	bold,
	channelMention,
	ChannelType,
	ClientOptions,
	codeBlock,
	Collection,
	GatewayIntentBits,
	GuildChannel,
	GuildExplicitContentFilter,
	GuildVerificationLevel,
	inlineCode,
	italic,
	LocaleString,
	Partials,
	PresenceUpdateStatus,
	time,
	TimestampStyles,
	User,
	userMention,
	WebhookClientData
} from 'discord.js';
import i18next, { getFixedT, InterpolationOptions } from 'i18next';
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
export const timezone = envParseString('TIMEZONE');

export function channelList(value: Collection<string, GuildChannel>, t: TFunction): string {
	const textSize = value.reduce((acc, itm) => (acc += itm.type === ChannelType.GuildText ? 1 : 0), 0);
	const stageSize = value.reduce((acc, itm) => (acc += itm.type === ChannelType.GuildStageVoice ? 1 : 0), 0);
	const newsSize = value.reduce((acc, itm) => (acc += itm.type === ChannelType.GuildAnnouncement ? 1 : 0), 0);
	const voiceSize = value.reduce((acc, itm) => (acc += itm.type === ChannelType.GuildVoice ? 1 : 0), 0);
	const pubThreadSize = value.reduce((acc, itm) => (acc += itm.type === ChannelType.PublicThread ? 1 : 0), 0);

	return (
		[
			textSize
				? t(LanguageKeys.Guilds.Channels.GUILD_TEXT, {
						context: 'short',
						count: textSize
					})
				: null,
			voiceSize
				? t(LanguageKeys.Guilds.Channels.GUILD_VOICE, {
						context: 'short',
						count: voiceSize
					})
				: null,
			stageSize
				? t(LanguageKeys.Guilds.Channels.GUILD_STAGE_VOICE, {
						context: 'short',
						count: stageSize
					})
				: null,
			newsSize
				? t(LanguageKeys.Guilds.Channels.GUILD_NEWS, {
						context: 'short',
						count: newsSize
					})
				: null,
			pubThreadSize
				? t(LanguageKeys.Guilds.Channels.GUILD_PUBLIC_THREAD, {
						context: 'short',
						count: pubThreadSize
					})
				: null
		]
			.filter((a) => Boolean(a))
			.join(', ') || toTitleCase(t(LanguageKeys.Globals.Unknown))
	);
}

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
		SUCCESS: Emojis.Success,
		SUPPORT: Urls.Support,
		TCS: Urls.TheCornerStore,
		UNSPECIFIED: emojis.perms.notSpecified
	};
}

function parseInternationalizationFormatters(): I18nextFormatter[] {
	const { t } = i18next;

	return [
		{
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value),
			name: 'and'
		},
		{
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value.map((item: string) => inlineCode(item))),
			name: 'codeand'
		},
		{
			format: (value) => inlineCode(value),
			name: 'code'
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
			name: 'fulldate'
		},
		{
			format: (value) => codeBlock('', value),
			name: 'codeblock'
		},
		{
			format: (value, lng) =>
				new Intl.DateTimeFormat(lng, {
					dateStyle: 'short',
					timeStyle: 'medium',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value),
			name: 'datetime'
		},
		{
			format: (value: User) => (container.client.users.cache.has(value.id) ? userMention(value.id) : value.username),
			name: 'userMention'
		},
		{
			format: (value: string) => channelMention(value),
			name: 'channelMention'
		},
		{
			format: (value, lng) =>
				new Intl.DateTimeFormat(lng, {
					timeStyle: 'short',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value),
			name: 'time'
		},
		{
			format: (value, lng) =>
				new Intl.NumberFormat(lng, {
					compactDisplay: 'short',
					maximumFractionDigits: 2,
					notation: 'compact'
				}).format(value),
			name: 'numbercompact'
		},
		{
			format: (value: GuildVerificationLevel, lng) => {
				const t = getFixedT(lng!);
				let key: CustomGet<string, string>;

				switch (value) {
					case GuildVerificationLevel.High:
						key = LanguageKeys.Guilds.VerificationLevels.HIGH;
						break;
					case GuildVerificationLevel.Low:
						key = LanguageKeys.Guilds.VerificationLevels.LOW;
						break;
					case GuildVerificationLevel.Medium:
						key = LanguageKeys.Guilds.VerificationLevels.MEDIUM;
						break;
					case GuildVerificationLevel.None:
						key = LanguageKeys.Guilds.VerificationLevels.NONE;
						break;
					case GuildVerificationLevel.VeryHigh:
						key = LanguageKeys.Guilds.VerificationLevels.VERY_HIGH;
						break;
					default:
						key = LanguageKeys.Guilds.VerificationLevels.NONE;
				}

				return t(key);
			},
			name: 'verificationlevel'
		},
		{
			format: (value, lng) => getFixedT(lng!)(`guilds/permissions:${value}`),
			name: 'permissions'
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
			format: (value, lng) => channelList(value, getFixedT(lng!)),
			name: 'channellist'
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
			format: (value, lng, options) =>
				t(`guilds/contentFilters:explicitContentFilter${GuildExplicitContentFilter[value]}`, { lng, ...options }) as string,
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

export const PROJECT_ROOT = join(rootFolder, process.env.OVERRIDE_ROOT_PATH ?? 'dist');
export const LANGUAGE_ROOT = join(PROJECT_ROOT, 'languages');

function parseI18nOptions(): InternationalizationOptions {
	return {
		defaultLanguageDirectory: LANGUAGE_ROOT,
		defaultMissingKey: 'default',
		defaultNS: 'globals',
		fetchLanguage: async ({ guild }) => {
			if (!guild) return SupportedLanguages.EnglishUnitedStates;
			return (await readSettings(guild)).language;
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
		status: process.env.NODE_ENV === 'development' ? PresenceUpdateStatus.Invisible : PresenceUpdateStatus.Idle
	},
	regexPrefix: parseRegexPrefix(),
	shards: 'auto'
};
