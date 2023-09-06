import { FuzzySearch } from '#external/FuzzySearch';
import { LanguageKeys } from '#lib/i18n';
import { BrandingColors, Urls } from '#utils/constants';
import { conditionalField, removeEmptyFields, resolveEmbedField } from '#utils/util';
import {
    AmiiboSeriesEnum,
    CoffeeBeansEnum,
    CoffeeMilkEnum,
    CoffeeSugarEnum,
    GamesEnum,
    KKSliderSongs,
    RouteRequestPayloads,
    StarSignEnum,
    Villager,
    VillagerKey
} from '@foxxie/celestia-api-types';
import { fetch } from '@foxxie/fetch';
import { TFunction } from '@foxxie/i18n';
import { cast, toTitleCase } from '@ruffpuff/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Collection, EmbedBuilder, italic } from 'discord.js';

export async function fetchVillager(param: string): Promise<RouteRequestPayloads['CelestiaVillagersVillager']> {
    try {
        const data = await fetch(Urls.Celestia)
            .path('api', 'villagers', param)
            .json<RouteRequestPayloads['CelestiaVillagersVillager']>();

        return data;
    } catch {
        return {
            code: 404,
            error: 'Villager not found'
        };
    }
}

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

export function buildVillagerDisplay(data: Villager, t: TFunction, color?: number) {
    const none = t(LanguageKeys.Globals.None);
    const titles = t(LanguageKeys.Commands.Fun.AnimalcrossingTitles);

    const template = new EmbedBuilder() //
        .setThumbnail(data.art.villager) //
        .setAuthor({ name: `${toTitleCase(data.key)} [${data.keyJp}]`, iconURL: data.art.icon || undefined })
        .setFooter({ text: t(LanguageKeys.Commands.Fun.AnimalcrossingFooter) })
        .setColor(color || BrandingColors.Primary);

    if (data.description) template.setDescription(italic(data.description));

    const display = new PaginatedMessage({ template }) //
        .addPageEmbed(embed =>
            embed //
                .addFields([
                    resolveEmbedField(titles.personality, data.personality || none, true),
                    resolveEmbedField(titles.species, data.species ? toTitleCase(data.species) : none, true),
                    resolveEmbedField(titles.gender, data.gender, true),
                    resolveEmbedField(
                        t(`${LanguageKeys.Commands.Fun.AnimalcrossingTitles}.game`, { count: data.games.length }),
                        t(LanguageKeys.Globals.And, { value: formatGames(cast<GamesEnum[]>(data.games)) })
                    ),
                    resolveEmbedField(titles.catchphrase, data.catchphrase || none, true),
                    resolveEmbedField(titles.saying, data.favoriteSaying || none, true)
                ])
        );

    const hasTrivia = Boolean(data.siblings || data.skill || data.goal);

    display.addPageEmbed(embed => {
        embed.addFields(
            removeEmptyFields([
                conditionalField(hasTrivia, titles.siblings, data.siblings || none, true),
                conditionalField(hasTrivia, titles.skill, data.skill || none, true),
                conditionalField(hasTrivia, titles.goal, data.goal || none, true),
                conditionalField(
                    Boolean(data.coffeeRequest),
                    titles.coffee,
                    t(LanguageKeys.Commands.Fun.AnimalcrossingCoffee, {
                        beans: coffeeBeansEnumToString(cast<CoffeeBeansEnum>(data.coffeeRequest?.beans)),
                        milk: coffeeMilkEnumToString(cast<CoffeeMilkEnum>(data.coffeeRequest?.milk)),
                        sugar: coffeeSugarEnumToString(cast<CoffeeSugarEnum>(data.coffeeRequest?.sugar))
                    }),
                    true
                ),
                conditionalField(
                    Boolean(data.amiibo),
                    '• Amiibo',
                    `${
                        data.amiibo?.series === AmiiboSeriesEnum.Camper || data.amiibo?.series === AmiiboSeriesEnum.Sanrio
                            ? data.amiibo.series
                            : `Series ${data.amiibo?.series}`
                    } → #${data.amiibo?.cardNumber}`,
                    true
                )
            ])
        );

        embed.addFields([
            resolveEmbedField(
                titles.birthday,
                `${getZodiacEmoji(cast<StarSignEnum>(data.birthday.zodiac))} ${data.birthday.month} ${t(
                    LanguageKeys.Globals.NumberOrdinal,
                    { value: data.birthday.day }
                )}`,
                true
            )
        ]);

        if (data.song)
            embed.addFields(resolveEmbedField(titles.song, kKSliderSongEnumToString(cast<KKSliderSongs>(data.song)) || none));

        return embed;
    });

    if (data.art.card) {
        if (Array.isArray(data.art.card)) {
            for (const c of data.art.card) {
                display.addPageEmbed(embed => embed.setThumbnail(null).setImage(c));
            }
        } else {
            display.addPageEmbed(embed => embed.setThumbnail(null).setImage(data.art.card as string));
        }
    }

    return display;
}

export function formatGames(games: GamesEnum[]): string[] {
    return games.map((game, i) => {
        const bounday = i === 0 ? '*' : '';
        return `${bounday}${gamesEnumToString(game)}${bounday}`;
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
                return `${kkresult.groups!.name} K.K.`;
            }

            const otherResult = /kK(?<name>[A-z]+)/.exec(song);

            if (otherResult !== null && otherResult.groups!.name) {
                return `K.K. ${otherResult.groups!.name}`;
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
