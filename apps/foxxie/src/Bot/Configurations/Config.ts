import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { LogLevel } from '@sapphire/framework';
import { InternationalizationOptions } from '@sapphire/plugin-i18next';
import { cast } from '@sapphire/utilities';
import { envParseArray, envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';
import { ActivitiesOptions, ActivityType, ClientOptions, GatewayIntentBits, Partials, PresenceUpdateStatus, WebhookClientData } from 'discord.js';
import { join } from 'node:path';

import { Constants } from '../Resources/index.js';
import { Translate } from '../Resources/Intl/index.js';

setup(join(Constants.RootFolder, '.env'));

export class Config {
	private static ParseI18nOptions(): InternationalizationOptions {
		return {
			defaultLanguageDirectory: Config.LanguageRoot,
			defaultMissingKey: 'default',
			defaultNS: 'globals',
			fetchLanguage: async ({ guild }) => {
				if (!guild) return Translate.SupportedLanguages.EnglishUnitedStates;
				// return readSettings(guild, SettingsKeys.Language);
				return Translate.SupportedLanguages.EnglishUnitedStates;
			},
			formatters: Translate.ParseFormatters(),
			i18next: (_: string[], languages: string[]) => ({
				debug: false,
				defaultNS: 'globals',
				fallbackLng: {
					default: [Translate.SupportedLanguages.EnglishUnitedStates],
					[Translate.SupportedLanguages.SpanishLatinAmerica]: ['es-ES', Translate.SupportedLanguages.EnglishUnitedStates] // Latin America Spanish falls back to Spain Spanish
				},
				initImmediate: false,
				interpolation: Translate.ParseInterpolation(),
				lng: Translate.SupportedLanguages.EnglishUnitedStates,
				load: 'all',
				// overloadTranslationOptionHandler: (args: string[]) => ({ defaultValue: args[1] ?? LanguageKeys.Globals.DefaultT }),
				preload: languages,
				returnEmptyString: false,
				returnNull: false,
				returnObjects: true,
				supportedLngs: languages
			})
		};
	}

	private static ParsePresenceActivity(): ActivitiesOptions[] {
		const { CLIENT_PRESENCE_NAME } = process.env;
		if (!CLIENT_PRESENCE_NAME) return [];

		return [
			{
				name: envParseString('CLIENT_PRESENCE_NAME'),
				type: ActivityType.Playing
			}
		];
	}

	private static ParseRegexPrefix(): RegExp {
		const str = envParseString('CLIENT_REGEX_PREFIX');
		return new RegExp(str, 'i');
	}

	private static ParseWebhookError(): null | WebhookClientData {
		const { WEBHOOK_ERROR_TOKEN } = process.env;
		if (!WEBHOOK_ERROR_TOKEN) return null;

		return {
			id: envParseString('WEBHOOK_ERROR_ID'),
			token: WEBHOOK_ERROR_TOKEN
		};
	}

	public static readonly ClientOptions: ClientOptions = {
		allowedMentions: {
			parse: ['users']
		},
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
		i18n: Config.ParseI18nOptions(),
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
			activities: Config.ParsePresenceActivity(),
			status: envParseString(EnvKeys.ClientId) === Constants.BotIds.Foxxie ? PresenceUpdateStatus.Idle : PresenceUpdateStatus.Invisible
		},
		regexPrefix: Config.ParseRegexPrefix(),
		shards: 'auto'
	};

	public static readonly ClientOwners = envParseArray(EnvKeys.ClientOwners);

	public static readonly ProjectRoot = join(Constants.RootFolder, process.env.OVERRIDE_ROOT_PATH ?? 'dist');

	public static readonly CommandRoot = join(Config.ProjectRoot, 'Bot', 'TextCommands');

	public static readonly DefaultPaginationOptions = [
		PaginatedMessage.defaultActions[1], // first
		PaginatedMessage.defaultActions[2], // previous
		PaginatedMessage.defaultActions[5], // stop
		PaginatedMessage.defaultActions[3], // next
		PaginatedMessage.defaultActions[4], // last
		PaginatedMessage.defaultActions[0]
	];

	public static readonly DefaultPaginationOptionsWithoutSelectMenu = [
		PaginatedMessage.defaultActions[1], // first
		PaginatedMessage.defaultActions[2], // previous
		PaginatedMessage.defaultActions[5], // stop
		PaginatedMessage.defaultActions[3], // next
		PaginatedMessage.defaultActions[4] // last
	];

	public static readonly InhibitorRoot = join(Config.ProjectRoot, 'Bot', 'Services', 'Inhibitors');

	public static readonly LanguageRoot = join(Config.ProjectRoot, 'Bot', 'Intl', 'Languages');

	public static readonly LastFMCommand = join(Config.ProjectRoot, 'Last.FM', 'TextCommands', 'Base');

	public static TimeZone = envParseString(EnvKeys.Timezone);

	public static WebhookError = Config.ParseWebhookError();
}

// FoxxiePaginatedMessageEmbedFields.defaultActions = defaultPaginationOptions;
PaginatedMessage.defaultActions = Config.DefaultPaginationOptions;
