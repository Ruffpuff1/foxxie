process.env.NODE_ENV ??= 'development';

import { localeMap } from '#languages';
import { LanguageKeys } from '#lib/i18n';
import { emojis, rootFolder } from '#utils/constants';
import { TimestampStyles, bold, time } from '@discordjs/builders';
import { EnvParse } from '@foxxie/env';
import { Formatter, TFunction, getT, i18next, init } from '@foxxie/i18n';
import { Iso6391Enum } from '@foxxie/i18n-codes';
import { cast, toTitleCase } from '@ruffpuff/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { type LogLevel } from '@sapphire/framework';
import { DurationFormatAssetsTime, DurationFormatter } from '@sapphire/time-utilities';
import { GatewayIntentBits, type LocaleString } from 'discord-api-types/v10';
import {
    ActivitiesOptions,
    ActivityType,
    ChannelType,
    ClientOptions,
    Collection,
    GuildChannel,
    GuildExplicitContentFilter,
    Partials,
    WebhookClientData,
    codeBlock,
    inlineCode
} from 'discord.js';
import { config } from 'dotenv-cra';
import type { InterpolationOptions } from 'i18next';
import { join } from 'node:path';

config({
    path: join(rootFolder, '.env')
});

export const formatDuration = (value: Date) => time(value, TimestampStyles.RelativeTime);
export const formatLongDate = (value: Date) => time(value, TimestampStyles.LongDate);

PaginatedMessage.defaultActions = [
    PaginatedMessage.defaultActions[2], // previous
    PaginatedMessage.defaultActions[5], // stop
    PaginatedMessage.defaultActions[3] // next
];

export const clientOwners = EnvParse.array('CLIENT_OWNERS');
export const webhookError = parseWebhookError();
export const timezone = EnvParse.string('TIMEZONE');

function parsePresenceActivity(): ActivitiesOptions[] {
    const { CLIENT_PRESENCE_NAME } = process.env;
    if (!CLIENT_PRESENCE_NAME) return [];

    return [
        {
            name: EnvParse.string('CLIENT_PRESENCE_NAME'),
            type: ActivityType.Listening
        }
    ];
}

export function getDurationOptions(lng: string): DurationFormatAssetsTime {
    return (localeMap.get(lng) ?? localeMap.get('en-US')!).duration;
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

function getDefaultVars(): Record<string, string | string[]> {
    return {
        SUCCESS: emojis.success,
        ERROR: emojis.error,
        LOADING: emojis.loading,
        CLIENT_ID: process.env.CLIENT_ID!,
        APPROVED: emojis.perms.granted,
        UNSPECIFIED: emojis.perms.notSpecified,
        TCS: 'https://discord.gg/ZAZ4yRezC7'
    };
}

function getInterpolation(): InterpolationOptions {
    return {
        escapeValue: false,
        defaultVariables: getDefaultVars()
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
            .filter(a => Boolean(a))
            .join(', ') || toTitleCase(t(LanguageKeys.Globals.Unknown))
    );
}

function getFormatters(): Formatter[] {
    return [
        {
            name: 'and',
            format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value)
        },
        {
            name: 'codeand',
            format: (value, lng) =>
                new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value.map((item: string) => inlineCode(item)))
        },
        {
            name: 'code',
            format: value => inlineCode(value)
        },
        {
            name: 'or',
            format: (value, lng) => new Intl.ListFormat(lng!, { type: 'disjunction' }).format(value)
        },
        {
            name: 'codeor',
            format: (value, lng) =>
                new Intl.ListFormat(lng!, { type: 'disjunction' }).format(value.map((item: string) => inlineCode(item)))
        },
        {
            name: 'duration',
            format: value => formatDuration(getDurationValue(value))
        },
        {
            name: 'fulldate',
            format: value => time(typeof value === 'string' ? new Date(value) : value, TimestampStyles.LongDate)
        },
        {
            name: 'codeblock',
            format: value => codeBlock('', value)
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
            name: 'time',
            format: (value, lng) =>
                new Intl.DateTimeFormat(lng, {
                    timeZone: timezone,
                    timeStyle: 'short'
                }).format(typeof value === 'string' ? new Date(value) : value)
        },
        {
            name: 'remaining',
            format: (value, lng, options) =>
                new DurationFormatter(getDurationOptions(lng!)).format(value, options.formatParams?.depth ?? 1)
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
            format: (value, lng) => getT(cast<LocaleString>(lng))(`guilds/verificationLevels:${value}`)
        },
        {
            name: 'permissions',
            format: (value, lng) => getT(cast<LocaleString>(lng))(`guilds/permissions:${value}`)
        },
        {
            name: 'permissionarray',
            format: (value: string[], lng) => {
                const t = getT(cast<LocaleString>(lng));
                const mapped = value.map(perm => t(`guilds/permissions:${perm}`)).map(bold);

                const and = new Intl.ListFormat(lng!, { type: 'conjunction' }).format(mapped);
                return and;
            }
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
            format: (value, lng) => channelList(value, getT(lng!))
        },
        {
            name: 'contentfilter',
            format: (value: GuildExplicitContentFilter, lng) => getT(lng!)(LanguageKeys.Guilds.ContentFilters.FilterArray[value])
        },

        {
            name: 'dateFormat',
            format: value => formatLongDate(getDurationValue(value))
        },
        {
            name: 'ordinal',
            format: (value, lng) => localeMap.get(lng || 'en-US')!.ordinal(value)
        }
    ];
}

export async function initI18n() {
    await init({
        languageDirectory: join(__dirname, 'languages'),
        returnObjects: true,
        returnEmptyString: false,
        returnNull: false,
        load: 'all',
        fallbackLng: 'en-US',
        defaultNS: 'globals',
        supportedLngs: [Iso6391Enum.EnglishUnitedStates, Iso6391Enum.SpanishMexico],
        interpolation: getInterpolation(),
        initImmediate: false,
        debug: false
    });

    for (const { name, format } of getFormatters()) {
        i18next.services.formatter!.add(name, format);
    }
}

export const clientOptions: ClientOptions = {
    defaultPrefix: EnvParse.string('CLIENT_PREFIX'),
    presence: {
        activities: parsePresenceActivity(),
        status: 'idle'
    },
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    regexPrefix: parseRegexPrefix(),
    loadDefaultErrorListeners: false,
    loadMessageCommandListeners: true,
    shards: 'auto',
    caseInsensitiveCommands: true,
    caseInsensitivePrefixes: true,
    allowedMentions: { parse: ['users'] },
    logger: {
        level: cast<LogLevel>(EnvParse.int('LOG_LEVEL'))
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
};
