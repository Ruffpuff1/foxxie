process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';

import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-logger/register';
import { container, LogLevel } from '@sapphire/framework';
import { config } from 'dotenv';
import { Formatters, ClientOptions, ActivitiesOptions } from 'discord.js';
import type { InternationalizationOptions } from '@sapphire/plugin-i18next';
import { isOnServer, ASSETS_FOLDER } from './lib/util';
import { ENV_FOLDER, emojis, envParseArray, LANGUAGE_FOLDER } from './lib/util';
import { aquireSettings, guildSettings } from './lib/database';
import type { InterpolationOptions, FormatFunction } from 'i18next';
import { channelArray, channelList, contentFilter } from './lib/i18n';
import { getCache } from './languages';
import { registerFont } from 'canvas-constructor/skia';
import { join } from 'path';
import type { PlayerOptions } from 'discord-player';

registerFont('RobotoSlab', [join(ASSETS_FOLDER, 'fonts', 'RobotoSlab-VariableFont_wght.ttf')]);

config({
    path: ENV_FOLDER
});

export function parsePresenceActivity(): ActivitiesOptions[] {
    const { CLIENT_PRESENCE_NAME } = process.env;
    if (!CLIENT_PRESENCE_NAME) return [];

    return [
        {
            name: CLIENT_PRESENCE_NAME,
            type: 'LISTENING'
        }
    ];
}

export interface ClientConfig {
    version: string | undefined;
    commitHash: string | undefined;
    communityServer: string;
}


export function mapPermissions(item: string, lng: string): string {
    return Formatters.bold(container.i18n.format(lng, `guilds/permissions:${item}`).toLowerCase());
}

export function getDefaultVars(): Record<string, string | undefined> {
    return {
        SUCCESS: emojis.success,
        ERROR: emojis.error,
        LOADING: emojis.loading,
        MUSIC: ':violin:',
        CLIENT_ID: process.env.CLIENT_ID,
        APPROVED: emojis.perms.granted,
        UNSPECIFIED: emojis.perms.notSpecified
    };
}

export function getInterpolation(): InterpolationOptions {
    return {
        escapeValue: false,
        defaultVariables: getDefaultVars(),
        format: (...[value, format, lng]: Parameters<FormatFunction>) => {
            switch (format) {
            case 'number': return getCache(lng).number.format(value);
            case 'and': return getCache(lng).and.format(value);
            case 'codeAnd': return getCache(lng).and.format(value.map((item: string) => Formatters.inlineCode(item)));
            case 'numberCompact': return getCache(lng).compactNumber.format(value);
            case 'duration': return getCache(lng).duration.format(Date.now() - value, 1);

            case 'code': return Formatters.inlineCode(value);
            case 'codeBlock': return Formatters.codeBlock('', value);

            case 'ordinal': return getCache(lng).ordinal(value);
            case 'fullDate': return getCache(lng).fullDate.format(value);
            case 'dateTime': return getCache(lng).dateTime.format(value);
            case 'dateShort': return getCache(lng).shortDate.format(value);
            case 'fullDateTime': return getCache(lng).longDateWithTime(value);
            case 'permissionArray': return formatPermissionsArray(lng as string, value);
            case 'channelArray': return channelArray(value, lng as string);
            case 'permissions': return container.i18n.format(lng as string, `guilds/permissions:${value}`);
            case 'vars': return getCache(lng).and.format(value.map((value: unknown) => `\`{${value}}\``));

            case 'contentFilter': return contentFilter(value, lng as string);
            case 'verificationLevel': return container.i18n.format(lng as string, `guilds/verificationLevels:${value}`);
            case 'channelList': return channelList(value, container.i18n.getT(lng as string));
            }
            return value;
        }
    };
}

function formatPermissionsArray(lng: string, array: string[]) {
    return getCache(lng).and.format(array.includes('ADMINISTRATOR')
        ? [mapPermissions('ADMINISTRATOR', lng)]
        : array.map(item => mapPermissions(item, lng))
    );
}

function parseInternationalizationOptions(): InternationalizationOptions {
    return {
        defaultMissingKey: 'default',
        defaultNS: 'globals',
        defaultLanguageDirectory: LANGUAGE_FOLDER,
        fetchLanguage: ({ guild }) => {
            if (!guild) return 'en-US';
            return aquireSettings(guild, guildSettings.language) as Promise<string | null>;
        },
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
    };
}

export function parseRegexPrefix(): RegExp {
    const str: string | undefined = process.env.CLIENT_REGEX_PREFIX;
    return new RegExp(str as string, 'i');
}

export const CONFIG: ClientConfig = {
    version: process.env.VERSION_NUM,
    commitHash: process.env.VERSION_HASH,
    communityServer: 'https://ruff.cafe/community'
};

export const CLIENT_OPTIONS: ClientOptions = {
    defaultPrefix: 'a.',
    presence: {
        activities: parsePresenceActivity(),
        status: 'idle'
    },
    audio: parseAudioOptions(),
    regexPrefix: parseRegexPrefix(),
    loadDefaultErrorListeners: false,
    shards: 'auto',
    i18n: parseInternationalizationOptions(),
    allowedMentions: { parse: ['users'] },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    logger: {
        level: isOnServer() ? LogLevel.Info : LogLevel.Debug
    },
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_VOICE_STATES'
    ],
    ...CONFIG
};

export const CLIENT_OWNERS = envParseArray('CLIENT_OWNERS');

function parseAudioOptions(): PlayerOptions {
    return {
        leaveOnEnd: false,
        leaveOnEmpty: false,
        leaveOnStop: false,
        ytdlOptions: {
            quality: process.env.AUDIO_QUALITY,
            highWaterMark: 1 << 25
        }
    };
}
