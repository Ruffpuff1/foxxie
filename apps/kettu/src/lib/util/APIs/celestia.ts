import { LanguageKeys } from '#lib/i18n';
import { CoffeeBeansEnum, CoffeeMilkEnum, CoffeeSugarEnum, GamesEnum, KkSliderSongs, StarSignEnum, Villager, VillagersEnum } from '@ruffpuff/celestia';
import type { Query, QueryGetCardByNameArgs, QueryGetVillagerByNameArgs } from '@ruffpuff/celestia';
import { fetch } from '@foxxie/fetch';
import { fromAsync, isErr, UserError } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import { cast, gql, toTitleCase } from '@ruffpuff/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import type { TFunction } from '@sapphire/plugin-i18next';
import { Colors } from '../constants';
import { FuzzySearch } from '@foxxie/fuzzysearch';

export async function fetchGraphQLAnimalCrossing<R extends AnimalCrossingReturnTypes>(
    query: string,
    variables: AnimalCrossingQueryVariables<R>
): Promise<AnimalCrossingResponse<R>> {
    try {
        return fetch('http://celestia:1234')
            .body(
                {
                    query,
                    variables
                },
                'json'
            )
            .post()
            .json<AnimalCrossingResponse<R>>();
    } catch {
        throw new UserError({ identifier: LanguageKeys.System.QueryFail });
    }
}

export async function fetchVillager(villager: VillagersEnum): Promise<Omit<Villager, '__typename'> | null> {
    const result = await fromAsync(() => fetchGraphQLAnimalCrossing<'getVillagerByName'>(getVillagerByName(), { villager }));
    if (isErr(result) || !result.value.data?.getVillagerByName) return null;

    return result.value.data.getVillagerByName;
}

export async function fuzzySearchVillagers(query: string, take = 20, cache?: VillagersEnum[]) {
    if (!cache) {
        cache = [];
        const data = await fetchVillagers();

        for (const key of data.data.getVillagers) {
            cache.push(key);
        }
    }

    const fuzz = new FuzzySearch(cache, ['key']);
    const result = fuzz.runFuzzy(query);

    return result.slice(0, take);
}

export function buildVillagerDisplay(data: Omit<Villager, '__typename'>, t: TFunction, color?: number) {
    const none = t(LanguageKeys.Globals.None);
    const titles = t(LanguageKeys.Commands.Websearch.AnimalcrossingTitles);

    const template = new MessageEmbed() //
        .setThumbnail(data.art) //
        .setAuthor({ name: `${toTitleCase(data.key)} [${data.keyJp}]` })
        .setFooter({ text: t(LanguageKeys.Commands.Websearch.AnimalcrossingFooter) })
        .setColor(color || Colors.Default);

    const display = new PaginatedMessage({ template }) //
        .addPageEmbed(embed =>
            embed //
                .addField(titles.personality, data.personality || none, true)
                .addField(titles.species, data.species ? toTitleCase(data.species) : none, true)
                .addField(titles.gender, data.gender, true)
                .addField(
                    t(`${LanguageKeys.Commands.Websearch.AnimalcrossingTitles}.game`, { count: data.games.length }),
                    t(LanguageKeys.Globals.And, { value: formatGames(data.games) })
                )
                .addField(titles.catchphrase, data.catchphrase || none, true)
                .addField(titles.saying, data.favoriteSaying || none, true)
        );

    if (data.coffeeRequest || data.siblings || data.skill || data.goal || data.song) {
        display.addPageEmbed(embed =>
            embed //
                .addField(titles.siblings, data.siblings || none, true)
                .addField(titles.skill, data.skill || none, true)
                .addField(titles.goal, data.goal || none, true)
                .addField(
                    titles.coffee,
                    data.coffeeRequest
                        ? t(LanguageKeys.Commands.Websearch.AnimalcrossingCoffee, {
                              beans: coffeeBeansEnumToString(data.coffeeRequest!.beans),
                              milk: coffeeMilkEnumToString(data.coffeeRequest!.milk),
                              sugar: coffeeSugarEnumToString(data.coffeeRequest!.sugar)
                          })
                        : none
                )
                .addField(titles.song, kKSliderSongEnumToString(data.song!) || none)
        );
    }

    if (data.amiiboCard?.length) {
        for (const card of data.amiiboCard) {
            display.addPageEmbed(embed =>
                embed //
                    .addField(titles.birthday, card.birthday, true)
                    .addField(`**${getZodiacEmoji(card.starSign as StarSignEnum)} ${titles.zodiac}**`, card.starSign, true)
                    .addField(titles.series, `${card.series}`, true)
                    .setImage(card.art)
            );
        }
    }

    return display;
}

export interface AnimalCrossingResponse<K extends keyof Omit<Query, '__typename'>> {
    data: Record<K, Omit<Query[K], '__typename'>>;
}

export type AnimalCrossingReturnTypes = keyof Pick<Query, 'getVillagerByName' | 'getCardByName' | 'getVillagers'>;

type AnimalCrossingQueryVariables<R extends AnimalCrossingReturnTypes> = R extends 'getVillagerByName'
    ? QueryGetVillagerByNameArgs
    : R extends 'getCardByName'
    ? QueryGetCardByNameArgs
    : R extends 'getVillagers'
    ? Record<string, unknown>
    : never;

export function formatGames(games: readonly string[]): string[] {
    return games.map((game, i) => {
        const bounday = i === 0 ? '*' : '';
        return `${bounday}${gamesEnumToString(cast<GamesEnum>(game))}${bounday}`;
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

export function kKSliderSongEnumToString(song: KkSliderSongs) {
    switch (song) {
        case KkSliderSongs.AnimalCity:
            return 'Animal City';
        case KkSliderSongs.CafeKk:
            return 'Café K.K.';
        case KkSliderSongs.Drivin:
            return "Drivin'";
        case KkSliderSongs.ForestLife:
            return 'Forest Life';
        case KkSliderSongs.GoKkRider:
            return 'Go K.K. Rider';
        case KkSliderSongs.ILoveYou:
            return 'I love you';
        case KkSliderSongs.KkLoveSong:
            return 'K.K. Love Song';
        case KkSliderSongs.KkRobotSynth:
            return 'K.K. Robot synth';
        case KkSliderSongs.MarineSong2001:
            return 'Marine Song 2001';
        case KkSliderSongs.MountainSong:
            return 'Mountain Song';
        case KkSliderSongs.MyPlace:
            return 'My Place';
        case KkSliderSongs.OnlyMe:
            return 'Only Me';
        case KkSliderSongs.SpringBlossoms:
            return 'Spring Blossoms';
        case KkSliderSongs.StaleCupcakes:
            return 'Stale Cupcakes';
        case KkSliderSongs.SteepHill:
            return 'Steep Hill';
        case KkSliderSongs.SurfinKk:
            return "Surfin' K.K.";
        case KkSliderSongs.TheKFunk:
            return 'The K Funk';
        case KkSliderSongs.ToTheEdge:
            return 'To the edge';
        case KkSliderSongs.TwoDaysAgo:
            return 'Two Days ago';
        case KkSliderSongs.WelcomeHorizons:
            return 'Welcome Horizons';
        default: {
            const kkresult = /(?<name>[A-z]+)KK/.exec(song);

            if (kkresult !== null && kkresult.groups!.name) {
                return `${kkresult.groups!.name} K.K.`;
            }

            const otherResult = /KK(?<name>[A-z]+)/.exec(song);

            if (otherResult !== null && otherResult.groups!.name) {
                return `K.K. ${otherResult.groups!.name}`;
            }

            return song;
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

export function getZodiacEmoji(starSign: StarSignEnum): `:${Lowercase<StarSignEnum>}:` {
    return `:${starSign.toLowerCase()}:` as `:${Lowercase<StarSignEnum>}:`;
}

export async function fetchVillagers() {
    return fetchGraphQLAnimalCrossing<'getVillagers'>(getVillagers(), {});
}

export const getVillagers = () => gql`
    {
        getVillagers
    }
`;

export const getVillagerByName = () => `
    query($villager: VillagersEnum!) {
        getVillagerByName(villager: $villager) {
            key
            keyJp
            gender
            species
            personality
            catchphrase
            favoriteSaying
            description
            games
            amiiboCard {
                key
                series
                starSign
                birthday
                art
            }
            art
            coffeeRequest {
                beans
                milk
                sugar
            }
            siblings
            skill
            song
            goal
        }
    }
`;

export const getCardByName = () => `
query($card: String!) {
    getCardByNumber(card: $card) {
        art
        birthday
        starSign
        series
        art
    }
}`;
