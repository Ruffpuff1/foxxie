process.env.NODE_ENV ??= 'development';

import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { LogLevel } from '@sapphire/framework';
import type { I18nextFormatters } from '@sapphire/plugin-i18next';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';
import { GatewayIntentBits } from 'discord-api-types/v10';
import { ClientOptions, Formatters } from 'discord.js';
import { config } from 'dotenv-cra';
import { join } from 'node:path';
import type { InterpolationOptions } from 'i18next';
import { Emojis } from '#utils/constants';
import { duration, longDate } from '#utils/util';

config({
    path: join(process.cwd(), '.env')
});

PaginatedMessage.defaultActions = [
    PaginatedMessage.defaultActions[0], // select menu
    PaginatedMessage.defaultActions[2], // previous
    PaginatedMessage.defaultActions[5], // stop
    PaginatedMessage.defaultActions[3] // next
];

export function getFormatters(): I18nextFormatters[] {
    return [
        {
            name: 'and',
            format: (value, lng = 'en-US') => new Intl.ListFormat(lng, { type: 'conjunction' }).format(value)
        },
        {
            name: 'codeand',
            format: (value, lng = 'en-US') => new Intl.ListFormat(lng, { type: 'conjunction' }).format(value.map((item: any) => Formatters.inlineCode(item)))
        },
        {
            name: 'dateFormat',
            format: value => longDate(getDurationValue(value))
        },
        {
            name: 'duration',
            format: value => duration(getDurationValue(value))
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

export function getInterpolation(): InterpolationOptions {
    return {
        escapeValue: false,
        defaultVariables: {
            ERROR: Emojis.Error,
            LOADING: Emojis.Loading
        }
    };
}

export const clientOptions: ClientOptions = {
    presence: {
        status: 'idle'
    },
    i18n: {
        fetchLanguage: ({ guild }) => {
            if (!guild) return 'en-US';

            return 'en-US';
        },
        formatters: getFormatters(),
        i18next: (_: string[], languages: string[]) => ({
            supportedLngs: languages,
            ignoreJSONStructure: true,
            preload: languages,
            returnObjects: true,
            returnEmptyString: false,
            returnNull: false,
            load: 'all',
            lng: 'en-US',
            fallbackLng: 'en-US',
            defaultNS: 'globals',
            interpolation: getInterpolation(),
            overloadTranslationOptionHandler: (args: unknown[]) => ({ defaultValue: args[1] ?? 'globals:defaultT' }),
            initImmediate: false
        })
    },
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
    partials: ['CHANNEL'],
    shards: 'auto',
    logger: {
        level: LogLevel.Debug
    }
};
