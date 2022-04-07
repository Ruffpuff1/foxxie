/* eslint-disable no-unused-vars */
import { join } from 'path';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

export const enum Colors {
    PokemonBird = 0x969696,
    Red = 0xff5c5c,
    Orange = 0xf79454,
    Yellow = 0xffdb5c,
    Green = 0x5dba7d,
    TheCornerStoreStarboard = 0xfff59f,
    BlurpleOld = 0x7289db,
    Blurple = 0x5865f2
}

export const enum BrandingColors {
    Primary = 0xed7c7d,
    Secondary = 0x4583c7
}

// eslint-disable-next-line max-len
export const justinName = 'Justin Giraffe-Whore-Blobfish-Anglerfish-Femboy-Filbert-Party Pooper-Short Spaghetti Dick-Lil Bitch-Jiu-Jutsu-Yandere-Tsundere-Sex Slave-Justie-Vuccum-Stalker-Canadian Murderer-Monsieur Casanova Fairness Know It All Wholesome Cutie Pie-Witch-Pendejo-Dennis';

export const starboardEmojis: string[] = ['⭐', '🌞', '🌠', '🌟', '✨', '💫', '🌌'];

export const emojis = {
    success: '<:TickYes:894419647439466556>',
    error: '<:TickNo:894420222084280331>',
    loading: '<a:HotCoffee:824751934539825232>',
    perms: {
        granted: '<:PermsEnabled:894420447091904563>',
        notSpecified: '<:PermsUnspecified:894420872234942466>',
        denied: '<:PermsDisabled:894420679934484561>'
    },
    boosts: [
        '<a:boost1:904581076377292820>',
        '<a:boost2:904581123445776464>',
        '<a:boost3:904581171202097152>'
    ],
    reactions: {
        no: '887148158692515891',
        yes: '887148158767992842'
    }
};

export const connect4Emojis = {
    C4_EMPTY: '<:C4Empty:904581240676569118>',
    PLAYER1: '<:C4P1:904581300378292296>',
    PLAYER2: '<:C4P2:904581453759791104>',
    PLAYER1_WIN: '<:C4P1Win:904581371014561822>',
    PLAYER2_WIN: '<:C4P2Win:904581413750337556>'
};

export enum LanguageEmojis {
    'en-US' = '🇺🇸',
    'es-MX' = '🇲🇽'
}

export const events = {
    COMMAND_LOGGING: 'commandLogging',
    GUILD_MEMBER_REMOVE_LOG_KICK: 'guildMemberRemove',
    MEMBER_COUNT: 'memberCount',
    MESSAGE_BOOST: 'messageBoost',
    MESSAGE_DELETE_LOG: 'messageDelete',
    MESSAGE_DELETE_MODERATION_LOG: 'messageDelete',
    MESSAGE_DELETE_RESPONSE: 'messageDelete',
    MESSAGE_DELETE_STARBOARD: 'messageDelete',
    MESSAGE_DISBOARD: 'messageDisboard',
    MESSAGE_STATS: 'messageStats',
    MESSAGE_UPDATE_LOG: 'messageUpdate',
    MODERATION_ENTRY_ADD: 'moderationEntryAdd',
    MODERATION_ENTRY_EDIT: 'moderationEntryEdit',
    SENTRY_ERROR: 'sentryError',
    SLASH_COMMAND_CREATE: 'slashCommandCreate',
    TASK_ERROR: 'taskError',
    USER_MESSAGE: 'userMessage'
};

// times
export const time = {
    Millisecond: 1,
    Second: 1000,
    Minute: 1000 * 60,
    Hour: 1000 * 60 * 60,
    Day: 1000 * 60 * 60 * 24,
    Month: 1000 * 60 * 60 * 24 * (365 / 12),
    Year: 1000 * 60 * 60 * 24 * 365
};

// time for the duration formatter
export const DEFAULT_UNITS = {
    year: {
        1: 'year',
        DEFAULT: 'years'
    },
    month: {
        1: 'month',
        DEFAULT: 'months'
    },
    week: {
        1: 'week',
        DEFAULT: 'weeks'
    },
    day: {
        1: 'day',
        DEFAULT: 'days'
    },
    hour: {
        1: 'hour',
        DEFAULT: 'hours'
    },
    minute: {
        1: 'minute',
        DEFAULT: 'minutes'
    },
    second: {
        1: 'second',
        DEFAULT: 'seconds'
    }
};

export const enum Urls {
    Anime = 'https://kitsu.io/api/edge/anime',
    Color = 'https://color.aero.bot',
    Community = 'https://ruff.cafe/community',
    Disboard = 'https://disboard.org/',
    Dog = 'https://dog.ceo/api',
    Fox = 'https://randomfox.ca/floof/',
    Github = 'https://api.github.com/',
    Haste = 'https://www.toptal.com/developers/hastebin',
    Imgur = 'https://api.imgur.com/3',
    Isgd = 'https://is.gd/create.php',
    Lgbt = 'https://api.ravy.lgbt',
    Npm = 'https://registry.yarnpkg.com/',
    Repo = 'https://github.com/FoxxieBot/Foxxie',
    Webster = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/',
    WebtoonId = 'https://webtoon.p.rapidapi.com/canvas/search',
    WebtoonImage = 'https://webtoon-phinf.pstatic.net',
    WebtoonInfo = 'https://webtoon.p.rapidapi.com/canvas/titles/get-info',
    WebtoonReferer = 'http://m.webtoons.com/'
}

// dirs
export const ROOT_FOLDER = process.cwd();
export const ASSETS_FOLDER = join(ROOT_FOLDER, 'assets');
export const COPYPASTA_FOLDER = join(ROOT_FOLDER, 'dist', 'src', 'lib', 'copypastas');
export const ENV_FOLDER = join(ROOT_FOLDER, '.env');
export const LANGUAGE_FOLDER = join(ROOT_FOLDER, 'dist', 'src', 'languages');
export const SOCIAL_FOLDER = join(ASSETS_FOLDER, 'social');

export const actions = [PaginatedMessage.defaultActions[0], PaginatedMessage.defaultActions[2], PaginatedMessage.defaultActions[5], PaginatedMessage.defaultActions[3]];