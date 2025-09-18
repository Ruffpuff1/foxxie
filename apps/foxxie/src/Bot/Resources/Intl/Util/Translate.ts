import { container } from '@sapphire/pieces';
import { I18nextFormatter } from '@sapphire/plugin-i18next';
import { envParseString } from '@skyra/env-utilities';
import { CustomGet, EnvKeys } from '#lib/types';
import {
	bold,
	channelMention,
	codeBlock,
	GuildExplicitContentFilter,
	GuildVerificationLevel,
	inlineCode,
	italic,
	LocaleString,
	PermissionsString,
	time,
	TimestampStyles,
	User,
	userMention
} from 'discord.js';
import { getFixedT, InterpolationOptions } from 'i18next';

import { Config } from '../../../Configurations/Config.js';
import { EnglishUnitedStatesHandler } from '../../../Languages/en-US/constants.js';
import { SpanishLatinAmericaHandler } from '../../../Languages/es-419/constants.js';
import { Constants } from '../../Constants.js';
import { LanguageKeys } from '../LanguageKeys/index.js';
import { Handler } from './Handler.js';

export class Translate {
	public static FormatDuration(value: Date) {
		return time(value, TimestampStyles.RelativeTime);
	}

	public static FormatLongDate(value: Date) {
		return time(value, TimestampStyles.LongDate);
	}

	public static GetDurationValue(value: Date | number | string) {
		if (value instanceof Date) {
			return value;
		} else if (typeof value === 'string') {
			const timestamp = new Date(value);
			return timestamp;
		}

		return new Date(value);
	}

	public static GetHandler(name: LocaleString): Handler {
		return Translate.Handlers.get(name) ?? Translate.Handlers.get('en-US')!;
	}

	public static ParseFormatters(): I18nextFormatter[] {
		return [
			{
				format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value),
				name: Constants.LanguageFormatters.And
			},
			{
				format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value.map((item: string) => inlineCode(item))),
				name: Constants.LanguageFormatters.CodeAnd
			},
			{
				format: (value) => inlineCode(value),
				name: Constants.LanguageFormatters.Code
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
				format: (value) => Translate.FormatDuration(Translate.GetDurationValue(value)),
				name: Constants.LanguageFormatters.Duration
			},
			{
				format: (value) => time(Translate.GetDurationValue(value), TimestampStyles.LongDate),
				name: Constants.LanguageFormatters.FullDate
			},
			{
				format: (value) => codeBlock('', value),
				name: Constants.LanguageFormatters.CodeBlock
			},
			{
				format: (value, lng) =>
					new Intl.DateTimeFormat(lng, {
						dateStyle: 'short',
						timeStyle: 'medium',
						timeZone: Config.TimeZone
					}).format(typeof value === 'string' ? new Date(value) : value),
				name: Constants.LanguageFormatters.DateTime
			},
			{
				format: (value: User) => (container.client.users.cache.has(value.id) ? userMention(value.id) : value.username),
				name: Constants.LanguageFormatters.UserMention
			},
			{
				format: (value: string) => channelMention(value),
				name: Constants.LanguageFormatters.ChannelMention
			},
			{
				format: (value, lng) =>
					new Intl.DateTimeFormat(lng, {
						timeStyle: 'short',
						timeZone: Config.TimeZone
					}).format(typeof value === 'string' ? new Date(value) : value),
				name: Constants.LanguageFormatters.Time
			},
			{
				format: (value, lng) =>
					new Intl.NumberFormat(lng, {
						compactDisplay: 'short',
						maximumFractionDigits: 2,
						notation: 'compact'
					}).format(value),
				name: Constants.LanguageFormatters.NumberCompact
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
				name: Constants.LanguageFormatters.VerificationLevel
			},
			{
				format: (value) => Translate.FormatDuration(Translate.GetDurationValue(Date.now() + value)),
				name: Constants.LanguageFormatters.Remaining
			},
			{
				format: (value, lng) =>
					new Intl.DateTimeFormat(lng, {
						dateStyle: 'short',
						timeZone: Config.TimeZone
					}).format(typeof value === 'string' ? new Date(value) : value),
				name: 'dateshort'
			},
			{
				format: (value, lng) => {
					const date = new Intl.DateTimeFormat(lng, {
						dateStyle: 'long',
						timeZone: Config.TimeZone
					}).format(typeof value === 'string' ? new Date(value) : value);
					const time = new Intl.DateTimeFormat(lng, {
						hour: 'numeric',
						minute: 'numeric',
						timeZone: Config.TimeZone
					}).format(typeof value === 'string' ? new Date(value) : value);

					return `${date} ${time}`;
				},
				name: 'fulldatetime'
			},
			{
				format: (value) => Translate.FormatLongDate(Translate.GetDurationValue(value)),
				name: 'dateFormat'
			},
			{
				format: (value, lng) => Translate.GetHandler(lng as LocaleString).ordinal(value),
				name: 'ordinal'
			},
			{
				format: (value) => bold(value),
				name: Constants.LanguageFormatters.Bold
			},
			{
				format: (value: PermissionsString[], lng) => {
					const t = getFixedT(lng!);
					return t(LanguageKeys.Globals.And, { value: value.map((v) => t(Translate.PermissionStringToKey(v))).map(bold) });
				},
				name: Constants.LanguageFormatters.PermissionsArray
			},
			{
				format: (value: GuildExplicitContentFilter, lng) => {
					const t = getFixedT(lng!);
					let key: CustomGet<string, string>;

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

					return t(key);
				},
				name: Constants.LanguageFormatters.ExplicitContentFilter
			},
			{
				format: (value, lng, options) => {
					const formatter = Translate.GetHandler((lng ?? 'es-419') as LocaleString).duration;
					const precision = (options?.precision as number) ?? 2;
					return formatter.format(value, precision);
				},
				name: Constants.LanguageFormatters.DurationString
			},
			{
				format: (value) => italic(value),
				name: Constants.LanguageFormatters.Italic
			}
		];
	}

	public static ParseInterpolation(): InterpolationOptions {
		return {
			defaultVariables: Translate.ParseDefaultVariables(),
			escapeValue: false
		};
	}

	public static PermissionStringToKey(permission: PermissionsString) {
		return LanguageKeys.Guilds.Permissions[permission];
	}

	private static ParseDefaultVariables(): Record<string, string> {
		return {
			APPROVED: Constants.Emojis.Perms.Granted,
			CLIENT_ID: envParseString(EnvKeys.ClientId),
			ERROR: Constants.Emojis.Error,
			LOADING: Constants.Emojis.Loading,
			MUSIC: Constants.Emojis.Music,
			SUCCESS: Constants.Emojis.Success,
			SUPPORT: Constants.Urls.TheCornerStore,
			TCS: Constants.Urls.TheCornerStore,
			UNSPECIFIED: Constants.Emojis.Perms.NotSpecified
		};
	}

	public static readonly SupportedLanguages = {
		EnglishUnitedStates: 'en-US',
		SpanishLatinAmerica: 'es-419'
	};

	private static readonly Handlers = new Map<LocaleString, Handler>([
		['en-US', new EnglishUnitedStatesHandler()],
		['es-419', new SpanishLatinAmericaHandler()]
	]);
}
