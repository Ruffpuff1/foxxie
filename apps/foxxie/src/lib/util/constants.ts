import { join } from 'node:path';
import type { PostProcessorModule } from 'i18next';
import { TimeTypes } from '@sapphire/time-utilities';
import { fetch } from '@foxxie/fetch';

export const enum Colors {
    PokemonBird = 0x969696,
    Red = 0xff5c5c,
    Orange = 0xf79454,
    Yellow = 0xffdb5c,
    LemonYellow = 0xf1ab1d,
    Green = 0x5dba7d,
    Black = 0x737f8d,
    TheCornerStoreStarboard = 0xfff59f,
    BlurpleOld = 0x7289db,
    Blurple = 0x5865f2,
    Disboard = 0x25b8b8
}

export const enum BrandingColors {
    Primary = 0xed7c7d,
    Secondary = 0x4583c7
}

export const justinName =
    // eslint-disable-next-line max-len
    'Justin Giraffe-Whore-Blobfish-Anglerfish-Femboy-Filbert-Party Pooper-Short Spaghetti Dick-Lil Bitch-Jiu-Jutsu-Yandere-Tsundere-Sex Slave-Justie-Vuccum-Stalker-Canadian Murderer-Monsieur Casanova Fairness Know It All Wholesome Cutie Pie-Witch-Pendejo-Dennis meme-webtoon-man';

export const emojis = {
    success: '<:Check:916529451536363633>',
    error: '<:Cross:916529423430344754>',
    loading: '<a:HotCoffee:905458108225183765>',
    foxWiggle: '<a:foxwiggle:799197027568713748>',
    music: '🎶 🎻',
    perms: {
        granted: '<:PermsEnabled:894420447091904563>',
        notSpecified: '<:PermsUnspecified:894420872234942466>',
        denied: '<:PermsDisabled:894420679934484561>'
    },
    boosts: ['<a:boost1:904581076377292820>', '<a:boost2:904581123445776464>', '<a:boost3:904581171202097152>'],
    reactions: {
        no: '916529423430344754',
        yes: '916529451536363633'
    }
};

export const connect4Emojis = {
    C4_EMPTY: '<:C4Empty:904581240676569118>',
    PLAYER1: '<:C4P1:904581300378292296>',
    PLAYER2: '<:C4P2:904581453759791104>',
    PLAYER1_WIN: '<:C4P1Win:904581371014561822>',
    PLAYER2_WIN: '<:C4P2Win:904581413750337556>'
};

export const enum Schedules {
    Birthday = 'birthday',
    CheckStatusPage = 'checkStatusPage',
    Disboard = 'disboard',
    EndTempBan = 'endTempban',
    EndTempMute = 'endTempmute',
    EndTempNick = 'endTempnick',
    EndTempRestrictEmbed = 'endTemprestrictembed',
    PostAnalytics = 'postAnalytics',
    Reminder = 'reminder',
    ReminderRepeat = 'reminderRepeat',
    RemoveBirthdayRole = 'removeBirthdayRole',
    ResetSpotifyToken = 'resetSpotifyToken',
    UpdateClockChannel = 'updateClockChannel'
}

// time for the duration formatter
export const DEFAULT_UNITS = {
    [TimeTypes.Year]: {
        1: 'year',
        DEFAULT: 'years'
    },
    [TimeTypes.Month]: {
        1: 'month',
        DEFAULT: 'months'
    },
    [TimeTypes.Week]: {
        1: 'week',
        DEFAULT: 'weeks'
    },
    [TimeTypes.Day]: {
        1: 'day',
        DEFAULT: 'days'
    },
    [TimeTypes.Hour]: {
        1: 'hour',
        DEFAULT: 'hours'
    },
    [TimeTypes.Minute]: {
        1: 'minute',
        DEFAULT: 'minutes'
    },
    [TimeTypes.Second]: {
        1: 'second',
        DEFAULT: 'seconds'
    }
};

export const anyMentionRegExp = /<(@[!&]?|#)(\d{17,19})>/g;

export const enum Urls {
    Anime = 'https://kitsu.io/api/edge/anime',
    Bunny = 'https://api.bunnies.io/v2',
    Cat = 'https://api.thecatapi.com/v1/',
    Color = 'https://color.aero.bot',
    Community = 'https://ruff.cafe/community',
    CryptoCompare = 'https://min-api.cryptocompare.com/data/price',
    Disboard = 'https://disboard.org/',
    Dog = 'https://dog.ceo/api',
    Fox = 'https://randomfox.ca/floof/',
    Github = 'https://api.github.com/',
    GraphQLPokemon = 'https://graphqlpokemon.favware.tech',
    Haste = 'https://paste.ruff.cafe',
    Imgur = 'https://api.imgur.com/3',
    Isgd = 'https://is.gd/create.php',
    Npm = 'https://registry.yarnpkg.com/',
    Repo = 'https://github.com/Ruffpuff1/foxxie',
    Scam = 'https://api.phisherman.gg/v1/',
    StatusPage = 'https://discordstatus.com',
    TimezoneDb = 'http://api.timezonedb.com/v2.1/',
    Webster = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/',
    WebtoonId = 'https://webtoon.p.rapidapi.com/canvas/search',
    WebtoonImage = 'https://webtoon-phinf.pstatic.net',
    WebtoonInfo = 'https://webtoon.p.rapidapi.com/canvas/titles/get-info',
    WebtoonReferer = 'http://m.webtoons.com/',
    Wolfram = 'http://api.wolframalpha.com/v1'
}

export const rootFolder = process.cwd();
export const assetsFolder = join(rootFolder, 'assets');

export const allowedInviteIds = [
    // ID for `The Corner Store`, Foxxie's home server.
    '761512748898844702',
    /* Below are official Discord servers. DDevs, Testers, Townhall, DAPI, Demo Server, and Poker Night. */
    '613425648685547541',
    '197038439483310086',
    '169256939211980800',
    '81384788765712384',
    '670065151621332992',
    '831646372519346186',
    // Discord.JS server
    '222078108977594368',
    // Typescript Server
    '508357248330760243'
];

export const helpUsagePostProcessor: PostProcessorModule = {
    type: 'postProcessor',
    name: 'helpUsage',
    process(value, [key]) {
        // If the value is equal to the key then it is an empty usage, so return an empty string
        if (value === key) return '';
        // Otherwise just return the value
        return value;
    }
};

export const commit = async () =>
    fetch('https://api.github.com/repos/Ruffpuff1/foxxie/commits/main') //
        .json()
        .then((data: any) => data.sha.substring(0, 7))
        .catch(() => null);
