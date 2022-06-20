process.env.NODE_ENV ??= 'development';

import { join } from 'node:path';
import { config } from 'dotenv-cra';
import { emojis, rootFolder } from '#utils/constants';
import { time, TimestampStyles } from '@discordjs/builders';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { EnvParse } from '@foxxie/env';
import { Formatter, getT, i18next, init } from '@foxxie/i18n';
import { ActivitiesOptions, ClientOptions, Formatters, WebhookClientData } from 'discord.js';
import { type LocaleString, GatewayIntentBits } from 'discord-api-types/v10';
import type { InterpolationOptions } from 'i18next';
import type { LogLevel } from '@sapphire/framework';
import { localeMap } from '#languages';
import { Iso6391Enum } from '@foxxie/i18n-codes';

config({
    path: join(rootFolder, '.env')
});

export const formatDuration = (value: Date) => time(value, TimestampStyles.RelativeTime);
export const formatLongDate = (value: Date) => time(value, TimestampStyles.LongDate);

PaginatedMessage.defaultActions = [
    PaginatedMessage.defaultActions[0], // select menu
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
            name: EnvParse.string('TIMEZONE'),
            type: 'LISTENING'
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

function getFormatters(): Formatter[] {
    return [
        {
            name: 'and',
            format: (value, lng) => new Intl.ListFormat(lng!, { type: 'conjunction' }).format(value)
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
            format: value => formatDuration(getDurationValue(value))
        },
        {
            name: 'fulldate',
            format: (value, lng) =>
                new Intl.DateTimeFormat(lng, {
                    timeZone: timezone,
                    dateStyle: 'long'
                }).format(typeof value === 'string' ? new Date(value) : value)
        },
        {
            name: 'codeblock',
            format: value => Formatters.codeBlock('', value)
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
        debug: true
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
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    regexPrefix: parseRegexPrefix(),
    loadDefaultErrorListeners: false,
    loadMessageCommandListeners: true,
    shards: 'auto',
    caseInsensitiveCommands: true,
    caseInsensitivePrefixes: true,
    allowedMentions: { parse: ['users'] },
    logger: {
        level: EnvParse.int('LOG_LEVEL') as LogLevel
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages
    ]
};
