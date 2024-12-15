import { FuzzySearch } from '#external/FuzzySearch';
import { Urls } from '#utils/constants';
import {
    CoffeeBeansEnum,
    CoffeeMilkEnum,
    CoffeeSugarEnum,
    GamesEnum,
    KKSliderSongs,
    RouteRequestPayloads,
    StarSignEnum,
    VillagerKey
} from '@foxxie/celestia-api-types';
import { fetch } from '@foxxie/fetch';
import { toTitleCase } from '@ruffpuff/utilities';
import { Collection } from 'discord.js';

export const defaultFuzzyVillagerResult = [{ key: 'bob' }];

export async function fuzzySearchVillagers(query: string, take = 20, cache?: `${VillagerKey}`[]) {
    if (!cache) {
        cache = [];
        const data = await fetchVillagers();

        for (const key of data.villagers) {
            cache.push(key);
        }
    }

    const fuzz = new FuzzySearch(new Collection(cache.map(key => [key, { key }])), ['key']);
    const result = fuzz.runFuzzy(query);

    return result.length ? result.slice(0, take) : defaultFuzzyVillagerResult;
}

export async function fetchVillagers(): Promise<RouteRequestPayloads['CelestiaVillagers']> {
    const data = await fetch(Urls.Celestia).path('api', 'villagers').json<RouteRequestPayloads['CelestiaVillagers']>();

    return data;
}

export function formatGames(games: string[]): string[] {
    return games.map((game, i) => {
        const bounday = i === 0 ? '*' : '';
        return `${bounday}${game}${bounday}`;
    });
}

export function gamesEnumToString(game: GamesEnum) {
    switch (game) {
        case GamesEnum.AmiiboFestival:
            return 'Amiibo Festival';
        case GamesEnum.AnimalCrossing:
            return 'Animal Crossing';
        case GamesEnum.CityFolk:
            return 'City Folk';
        case GamesEnum.DoubutsuNoMori:
            return 'Dōbutsu no Mori';
        case GamesEnum.HappyHomeDesigner:
            return 'Happy Home Designer';
        case GamesEnum.HappyHomeParadise:
            return 'Happy Home Paradise';
        case GamesEnum.NewHorizons:
            return 'New Horizons';
        case GamesEnum.NewLeaf:
            return 'New Leaf';
        case GamesEnum.PocketCamp:
            return 'Pocket Camp';
        case GamesEnum.WildWorld:
            return 'Wild World';
    }
}

export function kKSliderSongEnumToString(song: KKSliderSongs) {
    switch (song) {
        case KKSliderSongs.AnimalCity:
            return 'Animal City';
        case KKSliderSongs.CafeKK:
            return 'Café K.K.';
        case KKSliderSongs.Drivin:
            return "Drivin'";
        case KKSliderSongs.ForestLife:
            return 'Forest Life';
        case KKSliderSongs.GoKKRider:
            return 'Go K.K. Rider';
        case KKSliderSongs.ILoveYou:
            return 'I love you';
        case KKSliderSongs.KKLoveSong:
            return 'K.K. Love Song';
        case KKSliderSongs.KKRobotSynth:
            return 'K.K. Robot synth';
        case KKSliderSongs.MarineSong2001:
            return 'Marine Song 2001';
        case KKSliderSongs.MountainSong:
            return 'Mountain Song';
        case KKSliderSongs.MyPlace:
            return 'My Place';
        case KKSliderSongs.OnlyMe:
            return 'Only Me';
        case KKSliderSongs.SpringBlossoms:
            return 'Spring Blossoms';
        case KKSliderSongs.StaleCupcakes:
            return 'Stale Cupcakes';
        case KKSliderSongs.SteepHill:
            return 'Steep Hill';
        case KKSliderSongs.SurfinKK:
            return "Surfin' K.K.";
        case KKSliderSongs.TheKFunk:
            return 'The K Funk';
        case KKSliderSongs.ToTheEdge:
            return 'To the edge';
        case KKSliderSongs.TwoDaysAgo:
            return 'Two Days ago';
        case KKSliderSongs.WelcomeHorizons:
            return 'Welcome Horizons';
        default: {
            const kkresult = /(?<name>[A-z]+)KK/.exec(song);

            if (kkresult !== null && kkresult.groups!.name) {
                return `${toTitleCase(kkresult.groups!.name)} K.K.`;
            }

            const otherResult = /kK(?<name>[A-z]+)/.exec(song);

            if (otherResult !== null && otherResult.groups!.name) {
                return `K.K. ${toTitleCase(otherResult.groups!.name)}`;
            }

            return toTitleCase(song);
        }
    }
}

export function coffeeBeansEnumToString(bean: CoffeeBeansEnum) {
    switch (bean) {
        case CoffeeBeansEnum.BlueMountain:
            return 'Blue Mountain';
        default:
            return bean;
    }
}

export function coffeeMilkEnumToString(milk: CoffeeMilkEnum) {
    switch (milk) {
        case CoffeeMilkEnum.ALittleBit:
            return 'A little bit';
        case CoffeeMilkEnum.NoneAtAll:
            return 'None at all';
        case CoffeeMilkEnum.TheRegularAmount:
            return 'The regular amount';
        case CoffeeMilkEnum.Lots:
            return 'Lots';
    }
}

export function coffeeSugarEnumToString(sugar: CoffeeSugarEnum) {
    switch (sugar) {
        case CoffeeSugarEnum.NoneAtAll:
            return 'None at all';
        case CoffeeSugarEnum.OneSpoonful:
            return 'One spoonful';
        case CoffeeSugarEnum.ThreeSpoonfuls:
            return 'Three spoonfuls';
        case CoffeeSugarEnum.TwoSpoonfuls:
            return 'Two spoonfuls';
    }
}

export function getZodiacEmoji(starSign: StarSignEnum): `:${Lowercase<StarSignEnum | 'scorpius'>}:` {
    switch (starSign) {
        case StarSignEnum.Scorpio:
            return ':scorpius:';
        default:
            return `:${starSign.toLowerCase()}:` as `:${Lowercase<StarSignEnum>}:`;
    }
}
