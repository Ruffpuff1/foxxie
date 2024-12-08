import { getHandler } from '#languages';
import { readSettings } from '#lib/Database/settings/functions';
import { LanguageKeys, SupportedLanguages } from '#lib/i18n';
import { CustomGet, EnvKeys } from '#lib/types';
import { Emojis, emojis, LanguageFormatters, rootFolder, Urls } from '#utils/constants';
import { FoxxiePaginatedMessageEmbedFields } from '#utils/External/FoxxiePaginatedMessageEmbedFields';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { container, LogLevel } from '@sapphire/framework';
import { I18nextFormatter, InternationalizationOptions, TFunction } from '@sapphire/plugin-i18next';
import { cast, toTitleCase } from '@sapphire/utilities';
import { envParseArray, envParseInteger, envParseString, setup } from '@skyra/env-utilities';
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

FoxxiePaginatedMessageEmbedFields.defaultActions = [
	PaginatedMessage.defaultActions[1], // first
	PaginatedMessage.defaultActions[2], // previous
	PaginatedMessage.defaultActions[5], // stop
	PaginatedMessage.defaultActions[3], // next
	PaginatedMessage.defaultActions[4] // last
];

export const clientOwners = envParseArray('CLIENT_OWNERS');
export const webhookError = parseWebhookError();
export const timezone = envParseString('TIMEZONE');

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

function parseRegexPrefix(): RegExp {
	const str = process.env.CLIENT_REGEX_PREFIX!;
	return new RegExp(str, 'i');
}

function getDurationValue(value: Date | string | number) {
	if (value instanceof Date) {
		return value;
	} else if (typeof value === 'string') {
		const timestamp = new Date(value);
		return timestamp;
	}

	return new Date(value);
}

function parseWebhookError(): WebhookClientData | null {
	const { WEBHOOK_ERROR_TOKEN } = process.env;
	if (!WEBHOOK_ERROR_TOKEN) return null;

	return {
		id: process.env.WEBHOOK_ERROR_ID!,
		token: WEBHOOK_ERROR_TOKEN
	};
}

function parseInternationalizationDefaultVariables() {
	return {
		SUCCESS: Emojis.Success,
		ERROR: Emojis.Error,
		LOADING: Emojis.Loading,
		APPROVED: emojis.perms.granted,
		UNSPECIFIED: emojis.perms.notSpecified,
		CLIENT_ID: process.env.CLIENT_ID!,
		TCS: Urls.TheCornerStore,
		SUPPORT: Urls.Support
	};
}

function parseInternationalizationInterpolation(): InterpolationOptions {
	return {
		escapeValue: false,
		defaultVariables: parseInternationalizationDefaultVariables()
	};
}

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
						count: textSize,
						context: 'short'
					})
				: null,
			voiceSize
				? t(LanguageKeys.Guilds.Channels.GUILD_VOICE, {
						count: voiceSize,
						context: 'short'
					})
				: null,
			stageSize
				? t(LanguageKeys.Guilds.Channels.GUILD_STAGE_VOICE, {
						count: stageSize,
						context: 'short'
					})
				: null,
			newsSize
				? t(LanguageKeys.Guilds.Channels.GUILD_NEWS, {
						count: newsSize,
						context: 'short'
					})
				: null,
			pubThreadSize
				? t(LanguageKeys.Guilds.Channels.GUILD_PUBLIC_THREAD, {
						count: pubThreadSize,
						context: 'short'
					})
				: null
		]
			.filter((a) => Boolean(a))
			.join(', ') || toTitleCase(t(LanguageKeys.Globals.Unknown))
	);
}

function parseInternationalizationFormatters(): I18nextFormatter[] {
	const { t } = i18next;

	return [
		{
			name: 'and',
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value)
		},
		{
			name: 'codeand',
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value.map((item: string) => inlineCode(item)))
		},
		{
			name: 'code',
			format: (value) => inlineCode(value)
		},
		{
			name: 'or',
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'disjunction' }).format(value)
		},
		{
			name: 'codeor',
			format: (value, lng) => new Intl.ListFormat(lng!, { type: 'disjunction' }).format(value.map((item: string) => inlineCode(item)))
		},
		{
			name: LanguageFormatters.Duration,
			format: (value) => formatDuration(getDurationValue(value))
		},
		{
			name: 'fulldate',
			format: (value) => time(typeof value === 'string' ? new Date(value) : value, TimestampStyles.LongDate)
		},
		{
			name: 'codeblock',
			format: (value) => codeBlock('', value)
		},
		{
			name: 'datetime',
			format: (value, lng) =>
				new Intl.DateTimeFormat(lng, {
					timeZone: timezone,
					dateStyle: 'short',
					timeStyle: 'medium'
				}).format(typeof value === 'string' ? new Date(value) : value)
		},
		{
			name: 'userMention',
			format: (value: User) => (container.client.users.cache.has(value.id) ? userMention(value.id) : value.username)
		},
		{
			name: 'channelMention',
			format: (value: string) => channelMention(value)
		},
		{
			name: 'time',
			format: (value, lng) =>
				new Intl.DateTimeFormat(lng, {
					timeZone: timezone,
					timeStyle: 'short'
				}).format(typeof value === 'string' ? new Date(value) : value)
		},
		{
			name: 'numbercompact',
			format: (value, lng) =>
				new Intl.NumberFormat(lng, {
					notation: 'compact',
					compactDisplay: 'short',
					maximumFractionDigits: 2
				}).format(value)
		},
		{
			name: 'verificationlevel',
			format: (value: GuildVerificationLevel, lng) => {
				const t = getFixedT(lng!);
				let key: CustomGet<string, string>;

				switch (value) {
					case GuildVerificationLevel.None:
						key = LanguageKeys.Guilds.VerificationLevels.NONE;
						break;
					case GuildVerificationLevel.Low:
						key = LanguageKeys.Guilds.VerificationLevels.LOW;
						break;
					case GuildVerificationLevel.Medium:
						key = LanguageKeys.Guilds.VerificationLevels.MEDIUM;
						break;
					case GuildVerificationLevel.High:
						key = LanguageKeys.Guilds.VerificationLevels.HIGH;
						break;
					case GuildVerificationLevel.VeryHigh:
						key = LanguageKeys.Guilds.VerificationLevels.VERY_HIGH;
						break;
					default:
						key = LanguageKeys.Guilds.VerificationLevels.NONE;
				}

				return t(key);
			}
		},
		{
			name: 'permissions',
			format: (value, lng) => getFixedT(lng!)(`guilds/permissions:${value}`)
		},
		{
			name: 'dateshort',
			format: (value, lng) =>
				new Intl.DateTimeFormat(lng, {
					dateStyle: 'short',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value)
		},
		{
			name: 'fulldatetime',
			format: (value, lng) => {
				const date = new Intl.DateTimeFormat(lng, {
					timeZone: timezone,
					dateStyle: 'long'
				}).format(typeof value === 'string' ? new Date(value) : value);
				const time = new Intl.DateTimeFormat(lng, {
					hour: 'numeric',
					minute: 'numeric',
					timeZone: timezone
				}).format(typeof value === 'string' ? new Date(value) : value);

				return `${date} ${time}`;
			}
		},
		{
			name: 'channellist',
			format: (value, lng) => channelList(value, getFixedT(lng!))
		},
		{
			name: 'dateFormat',
			format: (value) => formatLongDate(getDurationValue(value))
		},
		{
			name: 'ordinal',
			format: (_, lng) => getHandler(lng as LocaleString).name
		},
		{
			name: LanguageFormatters.Bold,
			format: (value) => bold(value)
		},
		{
			name: LanguageFormatters.ExplicitContentFilter,
			format: (value, lng, options) =>
				t(`guilds/contentFilters:explicitContentFilter${GuildExplicitContentFilter[value]}`, { lng, ...options }) as string
		},
		{
			name: LanguageFormatters.DurationString,
			format: (value, lng, options) => {
				const formatter = getHandler((lng ?? 'es-419') as LocaleString).duration;
				const precision = (options?.precision as number) ?? 2;
				return formatter.format(value, precision);
			}
		},
		{
			name: LanguageFormatters.Italic,
			format: (value) => italic(value)
		}
	];
}

export const PROJECT_ROOT = join(rootFolder, process.env.OVERRIDE_ROOT_PATH ?? 'dist');
export const LANGUAGE_ROOT = join(PROJECT_ROOT, 'languages');

function parseI18nOptions(): InternationalizationOptions {
	return {
		defaultNS: 'globals',
		defaultMissingKey: 'default',
		formatters: parseInternationalizationFormatters(),
		defaultLanguageDirectory: LANGUAGE_ROOT,
		fetchLanguage: async ({ guild }) => {
			if (!guild) return SupportedLanguages.EnglishUnitedStates;
			return (await readSettings(guild)).language;
		},
		i18next: (_: string[], languages: string[]) => ({
			supportedLngs: languages,
			preload: languages,
			returnObjects: true,
			returnEmptyString: false,
			returnNull: false,
			load: 'all',
			lng: SupportedLanguages.EnglishUnitedStates,
			fallbackLng: {
				[SupportedLanguages.SpanishLatinAmerica]: ['es-ES', SupportedLanguages.EnglishUnitedStates], // Latin America Spanish falls back to Spain Spanish
				default: [SupportedLanguages.EnglishUnitedStates]
			},
			defaultNS: 'globals',
			interpolation: parseInternationalizationInterpolation(),
			overloadTranslationOptionHandler: (args: string[]) => ({ defaultValue: args[1] ?? LanguageKeys.Globals.DefaultT }),
			initImmediate: false,
			debug: false
		})
	};
}

export const clientOptions: ClientOptions = {
	defaultPrefix: envParseString(EnvKeys.ClientPrefix),
	presence: {
		activities: parsePresenceActivity(),
		status: process.env.NODE_ENV === 'development' ? PresenceUpdateStatus.Invisible : PresenceUpdateStatus.Idle
	},
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
	regexPrefix: parseRegexPrefix(),
	loadDefaultErrorListeners: false,
	loadMessageCommandListeners: true,
	i18n: parseI18nOptions(),
	shards: 'auto',
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	allowedMentions: { parse: ['users'] },
	logger: {
		level: cast<LogLevel>(envParseInteger(EnvKeys.LogLevel))
	},
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
	]
};
