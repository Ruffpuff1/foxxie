process.env.NODE_ENV ??= 'development';

import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { durationOptions, ordinalOptions } from '#languages';
import { categories } from '#lib/game';
import { LanguageKeys } from '#lib/i18n';
import { emojis, rootFolder } from '#utils/constants';
import { toPermissionArray } from '#utils/transformers';
import { isString, toTitleCase } from '@ruffpuff/utilities';
import type { LogLevel } from '@sapphire/framework';
import { Formatter, getT, init, TFunction } from '@foxxie/i18n';
import i18next from 'i18next';
import { DurationFormatAssetsTime, DurationFormatter } from '@sapphire/time-utilities';
import type { NodeOptions } from '@skyra/audio';
import type { PermissionString } from 'discord.js';
import { ActivitiesOptions, ClientOptions, Collection, ExplicitContentFilterLevel, Formatters, GuildChannel, WebhookClientData } from 'discord.js';
import { config } from 'dotenv-cra';
import type { InterpolationOptions } from 'i18next';
import { join } from 'node:path';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { EnvParse } from '@foxxie/env';
import type { LocaleString } from 'discord-api-types/v10';
import { time, TimestampStyles } from '@discordjs/builders';

config({
    path: join(rootFolder, '.env')
});

export const duration = (value: Date) => time(value, TimestampStyles.RelativeTime);

export const longDate = (value: Date) => time(value, TimestampStyles.LongDate);

PaginatedMessage.defaultActions = [
    PaginatedMessage.defaultActions[0], // select menu
    PaginatedMessage.defaultActions[2], // previous
    PaginatedMessage.defaultActions[5], // stop
    PaginatedMessage.defaultActions[3] // next
];

export const CLIENT_OWNERS = EnvParse.array('CLIENT_OWNERS');
export const WEBHOOK_ERROR = parseWebhookError();
export const AUDIO_ALLOWED_GUILDS = EnvParse.array('AUDIO_ALLOWED_GUILDS');
export const TIMEZONE = EnvParse.string('TIMEZONE');

export function parsePresenceActivity(): ActivitiesOptions[] {
    const { CLIENT_PRESENCE_NAME } = process.env;
    if (!CLIENT_PRESENCE_NAME) return [];

    return [
        {
            name: EnvParse.string('TIMEZONE'),
            type: 'LISTENING'
        }
    ];
}

export function parseRegexPrefix(): RegExp {
    const str = process.env.CLIENT_REGEX_PREFIX!;
    return new RegExp(str, 'i');
}

function parseWebhookError(): WebhookClientData | null {
    const { WEBHOOK_ERROR_TOKEN } = process.env;
    if (!WEBHOOK_ERROR_TOKEN) return null;

    return {
        id: process.env.WEBHOOK_ERROR_ID!,
        token: WEBHOOK_ERROR_TOKEN
    };
}

export function getDurationOptions(lng: string): DurationFormatAssetsTime {
    return durationOptions.get(lng) ?? durationOptions.get('en-US')!;
}

export function channelList(value: Collection<string, GuildChannel>, t: TFunction): string {
    const textSize = value.reduce((acc, itm) => acc += itm.type === 'GUILD_TEXT' ? 1 : 0, 0);
    const stageSize = value.reduce((acc, itm) => acc += itm.type === 'GUILD_STAGE_VOICE' ? 1 : 0, 0);
    const storeSize = value.reduce((acc, itm) => acc += itm.type === 'GUILD_STORE' ? 1 : 0, 0);
    const newsSize = value.reduce((acc, itm) => acc += itm.type === 'GUILD_NEWS' ? 1 : 0, 0);
    const voiceSize = value.reduce((acc, itm) => acc += itm.type === 'GUILD_VOICE' ? 1 : 0, 0);
    const pubThreadSize = value.reduce((acc, itm) => acc += itm.type === 'GUILD_PUBLIC_THREAD' ? 1 : 0, 0);

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
            storeSize
                ? t(LanguageKeys.Guilds.Channels.GUILD_STORE, {
                      count: storeSize,
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
            .filter(a => Boolean(a))
            .join(', ') || toTitleCase(t(LanguageKeys.Globals.Unknown))
    );
}

export function getFormatters(): Formatter[] {
    return [
        {
            name: 'and',
            format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value)
        },
        {
            name: 'permissionarray',
            format: (value, lng) =>
                new Intl.ListFormat(lng!, { type: 'conjunction' }).format(toPermissionArray(value).map(item => mapPermissions(item as PermissionString, lng!)))
        },
        {
            name: 'channelarray',
            format: (value, lng) =>
                new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value.map((type: string) => `**${type.toLowerCase().replace(/_+/g, ' ')}**`))
        },
        {
            name: 'channellist',
            format: (value, lng) => channelList(value, getT(lng! as LocaleString))
        },
        {
            name: 'codeand',
            format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value.map((item: string) => Formatters.inlineCode(item)))
        },
        {
            name: 'code',
            format: value => Formatters.inlineCode(value)
        },
        {
            name: 'or',
            format: (value, lng) => new Intl.ListFormat(lng!, { type: 'disjunction' }).format(value)
        },
        {
            name: 'codeor',
            format: (value, lng) => new Intl.ListFormat(lng!, { type: 'disjunction' }).format(value.map((item: string) => Formatters.inlineCode(item)))
        },
        {
            name: 'duration',
            format: value => duration(getDurationValue(value))
        },
        {
            name: 'remaining',
            format: (value, lng, options) => new DurationFormatter(getDurationOptions(lng!)).format(value, options.formatParams?.depth ?? 1)
        },
        {
            name: 'fulldate',
            format: (value, lng) =>
                new Intl.DateTimeFormat(lng, {
                    timeZone: TIMEZONE,
                    dateStyle: 'long'
                }).format(isString(value) ? new Date(value) : value)
        },
        {
            name: 'codeblock',
            format: value => Formatters.codeBlock('', value)
        },
        {
            name: 'datetime',
            format: (value, lng) =>
                new Intl.DateTimeFormat(lng, {
                    timeZone: TIMEZONE,
                    dateStyle: 'short',
                    timeStyle: 'medium'
                }).format(isString(value) ? new Date(value) : value)
        },
        {
            name: 'time',
            format: (value, lng) =>
                new Intl.DateTimeFormat(lng, {
                    timeZone: TIMEZONE,
                    timeStyle: 'short'
                }).format(isString(value) ? new Date(value) : value)
        },
        {
            name: 'ordinal',
            format: (value, lng) => ordinalOptions.get(lng ?? 'en-US')!(value)
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
            format: (value, lng) => getT(lng as LocaleString)(`guilds/verificationLevels:${value}`)
        },
        {
            name: 'permissions',
            format: (value, lng) => getT(lng as LocaleString)(`guilds/permissions:${value}`)
        },
        {
            name: 'contentfilter',
            format: (value: ExplicitContentFilterLevel, lng) => getT(lng as LocaleString)(LanguageKeys.Guilds.ContentFilters[value])
        },
        {
            name: 'dateshort',
            format: (value, lng) =>
                new Intl.DateTimeFormat(lng, {
                    dateStyle: 'short',
                    timeZone: TIMEZONE
                }).format(isString(value) ? new Date(value) : value)
        },
        {
            name: 'fulldatetime',
            format: (value, lng) => {
                const date = new Intl.DateTimeFormat(lng, {
                    timeZone: TIMEZONE,
                    dateStyle: 'long'
                }).format(isString(value) ? new Date(value) : value);
                const time = new Intl.DateTimeFormat(lng, {
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: TIMEZONE
                }).format(isString(value) ? new Date(value) : value);

                return `${date} ${time}`;
            }
        },
        {
            name: 'dateFormat',
            format: value => longDate(getDurationValue(value))
        }
    ];
}

export function getDurationValue(value: Date | string) {
    if (value instanceof Date) {
        return value;
    } else if (typeof value === 'string') {
        const timestamp = new Date(value);
        return timestamp;
    }

    return value;
}

export function mapPermissions(item: PermissionString, lng: string): string {
    return Formatters.bold(getT(lng as LocaleString)(LanguageKeys.Guilds.Permissions[item]).toLowerCase());
}

export function getDefaultVars(): Record<string, string | string[]> {
    return {
        SUCCESS: emojis.success,
        ERROR: emojis.error,
        LOADING: emojis.loading,
        MUSIC: emojis.music,
        CLIENT_ID: process.env.CLIENT_ID!,
        APPROVED: emojis.perms.granted,
        UNSPECIFIED: emojis.perms.notSpecified,
        RUFFPUFF: 'Ruffpuff#0017',
        RAIN: 'Waindwop ᓚᘏᗢ#7799',
        TCS: 'https://discord.gg/ZAZ4yRezC7',
        TRIVACATEGORIES: Object.keys(categories).filter(c => c !== 'general'),
        LANGUAGES: ['en-US', 'es-MX']
    };
}

export function getInterpolation(): InterpolationOptions {
    return {
        escapeValue: false,
        defaultVariables: getDefaultVars()
    };
}

export async function initI18n() {
    await init({
        languageDirectory: join(__dirname, 'languages'),
        returnObjects: true,
        returnEmptyString: false,
        returnNull: false,
        load: 'all',
        lng: 'en-US',
        fallbackLng: 'en-US',
        defaultNS: 'globals',
        interpolation: getInterpolation(),
        initImmediate: false,
        debug: true
    });

    for (const { name, format } of getFormatters()) {
        i18next.services.formatter!.add(name, format);
    }
}

export const CLIENT_OPTIONS: ClientOptions = {
    defaultPrefix: EnvParse.string('CLIENT_PREFIX'),
    presence: {
        activities: parsePresenceActivity(),
        status: 'idle'
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    audio: parseAudioOptions(),
    regexPrefix: parseRegexPrefix(),
    loadDefaultErrorListeners: false,
    loadMessageCommandListeners: true,
    shards: 'auto',
    caseInsensitiveCommands: true,
    caseInsensitivePrefixes: true,
    allowedMentions: { parse: ['users'] },
    tasks: {
        strategy: new ScheduledTaskRedisStrategy({
            bull: {
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: true
                },
                redis: {
                    host: process.env.REDIS_HOST,
                    port: EnvParse.int('REDIS_PORT'),
                    password: process.env.REDIS_PASSWORD,
                    db: 2
                }
            }
        })
    },
    logger: {
        level: EnvParse.int('LOG_LEVEL') as LogLevel
    },
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES']
};

function parseAudioOptions(): NodeOptions {
    return {
        password: EnvParse.string('LAVALINK_PASSWORD'),
        userID: process.env.CLIENT_ID!,
        shardCount: 0,
        hosts: {
            rest: `http://${process.env.LAVALINK_URL}`,
            ws: {
                url: `ws://${process.env.LAVALINK_URL}`,
                options: {
                    resumeKey: 'FOXXIE_RESUME_KEY',
                    resumeTimeout: 120
                }
            }
        }
    };
}
