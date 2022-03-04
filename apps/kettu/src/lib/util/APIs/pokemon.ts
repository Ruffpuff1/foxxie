/**
 * @license MIT
 * @Copyright Favware 2021
 */
import { fetch } from '@foxxie/fetch';
import { fromAsync, isErr, UserError } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import {
    Query,
    QueryGetLearnsetArgs,
    Gender,
    Stats,
    Abilities,
    QueryGetFuzzyPokemonArgs,
    QueryGetTypeMatchupArgs,
    QueryGetPokemonArgs,
    QueryGetFuzzyMoveArgs,
    QueryGetAbilityArgs,
    QueryGetFuzzyAbilityArgs,
    QueryGetItemArgs,
    QueryGetFuzzyItemArgs,
    QueryGetMoveArgs,
    PokemonEnum,
    EvYields,
    Pokemon,
    MovesEnum,
    Move
} from '@favware/graphql-pokemon';
import { Emojis } from '../constants';
import { gql, toTitleCase } from '@ruffpuff/utilities';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { MessageEmbed } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/builders';
import { Colors } from '..';
import type { TFunction } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';

export async function fetchGraphQLPokemon<R extends PokemonQueryReturnTypes>(query: string, variables: PokemonQueryVariables<R>): Promise<PokemonResponse<R>> {
    const result = await fromAsync(async () =>
        fetch('https://graphqlpokemon.favware.tech', 'POST')
            .header({
                'Content-Type': 'application/json'
            })
            .body(
                JSON.stringify({
                    query,
                    variables
                })
            )
            .json<PokemonResponse<R>>()
    );

    if (isErr(result)) {
        throw new UserError({
            identifier: LanguageKeys.System.QueryFail
        });
    }

    return result.value;
}

interface PokemonResponse<K extends keyof Omit<Query, '__typename'>> {
    data: Record<K, Omit<Query[K], '__typename'>>;
}

type PokemonQueryReturnTypes = keyof Pick<
    Query,
    'getAbility' | 'getFuzzyAbility' | 'getItem' | 'getMove' | 'getPokemon' | 'getLearnset' | 'getTypeMatchup' | 'getFuzzyItem' | 'getFuzzyMove' | 'getFuzzyPokemon'
>;

type PokemonQueryVariables<R extends PokemonQueryReturnTypes> = R extends 'getAbility'
    ? QueryGetAbilityArgs
    : R extends 'getFuzzyAbility'
    ? QueryGetFuzzyAbilityArgs
    : R extends 'getItem'
    ? QueryGetItemArgs
    : R extends 'getFuzzyItem'
    ? QueryGetFuzzyItemArgs
    : R extends 'getMove'
    ? QueryGetMoveArgs
    : R extends 'getFuzzyMove'
    ? QueryGetFuzzyMoveArgs
    : R extends 'getPokemon'
    ? QueryGetPokemonArgs
    : R extends 'getFuzzyPokemon'
    ? QueryGetFuzzyPokemonArgs
    : R extends 'getLearnset'
    ? QueryGetLearnsetArgs
    : R extends 'getTypeMatchup'
    ? QueryGetTypeMatchupArgs
    : never;

export async function getPokemon(pokemon: PokemonEnum) {
    const result = await fromAsync(async () => {
        const data = await fetchGraphQLPokemon<'getPokemon'>(getPokemonString, { pokemon });
        return data.data.getPokemon;
    });

    if (isErr(result)) {
        return null;
    }

    return result.value;
}

export async function getMove(move: MovesEnum) {
    const result = await fromAsync(async () => {
        const data = await fetchGraphQLPokemon<'getMove'>(getMoveString, { move });
        return data.data.getMove;
    });

    if (isErr(result)) {
        return null;
    }

    return result.value;
}

export interface DefaultEntry<T> {
    key: T;
    name: `⭐ ${string}`;
}

export const getMoveString = gql`
    query getMove($move: MovesEnum!) {
        getMove(move: $move) {
            key
            name
            shortDesc
            type
            basePower
            pp
            category
            accuracy
            priority
            target
            contestType
            bulbapediaPage
            serebiiPage
            smogonPage
            isNonstandard
            isZ
            isGMax
            desc
            maxMovePower
            zMovePower
            isFieldMove
        }
    }
`;

export const getPokemonString = gql`
    fragment flavors on Flavor {
        game
        flavor
    }
    fragment abilities on Abilities {
        first
        second
        hidden
        special
    }
    fragment stats on Stats {
        hp
        attack
        defense
        specialattack
        specialdefense
        speed
    }
    fragment evYields on EvYields {
        hp
        attack
        defense
        specialattack
        specialdefense
        speed
    }
    fragment genders on Gender {
        male
        female
    }
    fragment pokemon on Pokemon {
        key
        num
        species
        types
        evYields {
            ...evYields
        }
        abilities {
            ...abilities
        }
        baseStats {
            ...stats
        }
        gender {
            ...genders
        }
        baseStatsTotal
        color
        eggGroups
        evolutionLevel
        height
        weight
        otherFormes
        cosmeticFormes
        sprite
        shinySprite
        backSprite
        shinyBackSprite
        smogonTier
        bulbapediaPage
        serebiiPage
        smogonPage
        isEggObtainable
        minimumHatchTime
        maximumHatchTime
        levellingRate
        catchRate {
            base
            percentageWithOrdinaryPokeballAtFullHealth
        }
        flavorTexts {
            ...flavors
        }
    }
    fragment evolutionsData on Pokemon {
        key
        species
        evolutionLevel
    }
    fragment evolutions on Pokemon {
        evolutions {
            ...evolutionsData
            evolutions {
                ...evolutionsData
            }
        }
        preevolutions {
            ...evolutionsData
            preevolutions {
                ...evolutionsData
            }
        }
    }
    query getPokemon($pokemon: PokemonEnum!) {
        getPokemon(pokemon: $pokemon, takeFlavorTexts: 2) {
            ...pokemon
            ...evolutions
        }
    }
`;

export const getFuzzyPokemonString = gql`
    query getFuzzyPokemon($pokemon: String!, $take: Int!) {
        getFuzzyPokemon(pokemon: $pokemon, take: $take) {
            key
            species
            num
            forme
            formeLetter
        }
    }
`;

export const getFuzzyMoveString = gql`
    query getFuzzyMove($move: String!, $take: Int!) {
        getFuzzyMove(move: $move, take: $take) {
            key
            name
        }
    }
`;

const DefaultPokemonList: DefaultEntry<PokemonEnum>[] = [
    {
        key: PokemonEnum.Vulpix,
        name: '⭐ Vulpix'
    },
    {
        key: PokemonEnum.Vulpixalola,
        name: '⭐ Alolan Vulpix'
    },
    {
        key: PokemonEnum.Ninetales,
        name: '⭐ Ninetales'
    },
    {
        key: PokemonEnum.Ninetalesalola,
        name: '⭐ Alolan Ninetales'
    },
    {
        key: PokemonEnum.Shaymin,
        name: '⭐ Shaymin'
    },
    {
        key: PokemonEnum.Umbreon,
        name: '⭐ Umbreon'
    }
];

const DefaultMoveList: DefaultEntry<MovesEnum>[] = [
    {
        key: MovesEnum.Splash,
        name: '⭐ Splash'
    },
    {
        key: MovesEnum.Waterfall,
        name: '⭐ Waterfall'
    },
    {
        key: MovesEnum.Accelerock,
        name: '⭐ Accelerock'
    },
    {
        key: MovesEnum.Moongeistbeam,
        name: '⭐ Moongeistbean'
    },
    {
        key: MovesEnum.Drainingkiss,
        name: '⭐ Draining Kiss'
    },
    {
        key: MovesEnum.Hyperbeam,
        name: '⭐ Hyperbeam'
    }
];

export async function fuzzySearchPokemon(pokemon: string, take = 20, includeSpecialPokemon = true) {
    const result = await fromAsync(async () => {
        const data = await fetchGraphQLPokemon<'getFuzzyPokemon'>(getFuzzyPokemonString, { pokemon, take });
        return data.data.getFuzzyPokemon;
    });

    if (isErr(result)) {
        return DefaultPokemonList;
    }

    if (!includeSpecialPokemon) {
        const filtered = result.value.filter(pokemon => !pokemon.forme && pokemon.num >= 0);
        if (!filtered.length) return DefaultPokemonList;

        return filtered;
    }

    return result.value;
}

export async function fuzzySearchMove(move: string, take = 20) {
    const result = await fromAsync(async () => {
        const data = await fetchGraphQLPokemon<'getFuzzyMove'>(getFuzzyMoveString, { move, take });
        return data.data.getFuzzyMove;
    });

    if (isErr(result)) {
        return DefaultMoveList;
    }

    return result.value;
}

export type PokemonSpriteTypes = 'sprite' | 'backSprite' | 'shinySprite' | 'shinyBackSprite';

enum StatsEnum {
    hp = 'HP',
    attack = 'ATK',
    defense = 'DEF',
    specialattack = 'SPA',
    specialdefense = 'SPD',
    speed = 'SPE'
}

/**
 * Parses a Bulbapedia-like URL to be properly embeddable on Discord
 * @param url URL to parse
 */
export function parseBulbapediaURL(url: string) {
    return url.replace(/[ ]/g, '_').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

export function moveDisplayBuilder(move: Omit<Move, '__typename'>, t: TFunction) {
    const externalSources = [`[Bulbapedia](${parseBulbapediaURL(move.bulbapediaPage)} )`, `[Serebii](${move.serebiiPage})`, `[Smogon](${move.smogonPage})`].join(' | ');
    const MovePageLabels = t(LanguageKeys.Commands.Websearch.PokemonMoveSelectPages);

    const display = new PaginatedMessage({
        template: new MessageEmbed()
            .setColor(Colors.Default)
            .setAuthor({ name: `Move - ${toTitleCase(move.name)}` })
            .setDescription(move.desc || move.shortDesc)
    })
        .setSelectMenuOptions(pageIndex => ({ label: MovePageLabels[pageIndex - 1] }))
        .addPageEmbed(embed => {
            if (move.isFieldMove) {
                embed //
                    .addField('Effect outside of battle', move.isFieldMove, false);
            }

            return embed
                .addField('Type', move.type, true)
                .addField('Base Power', move.basePower, true)
                .addField('PP', move.pp.toLocaleString(), true)
                .addField('Accuracy', `${move.accuracy}%`, true)
                .addField('External Resources', externalSources);
        });

    // If the move has zMovePower or maxMovePower then squeeze it in between as a page
    if (move.zMovePower || move.maxMovePower) {
        display.addPageEmbed(embed => {
            if (move.maxMovePower) {
                embed.addField('Base power as MAX move (Dynamax)', move.maxMovePower.toLocaleString());
            }
            if (move.zMovePower) {
                embed.addField('Base power as Z-Move (Z-Crystal)', move.zMovePower.toLocaleString());
            }

            embed.addField('External Resources', externalSources);
            return embed;
        });
    }

    return display.addPageEmbed(embed =>
        embed
            .addField('Z-Crystal', move.isZ ?? 'None', true)
            .addField('G-MAX Pokémon', move.isGMax ?? 'None', true)
            .addField('Available in Generation 8', move.isNonstandard === 'Past' ? 'No' : 'Yes', true)
            .addField('External Resources', externalSources)
    );
}

export function pokemonDisplayBuilder(pokeDetails: Omit<Pokemon, '__typename'>, spriteToGet: PokemonSpriteTypes, t: TFunction) {
    const abilities = getAbilities(pokeDetails.abilities);
    const baseStats = getBaseStats(pokeDetails.baseStats);
    const evYields = getEvYields(pokeDetails.evYields);
    const evoChain = getEvoChain(pokeDetails);

    const titles = t(LanguageKeys.Commands.Websearch.PokemonTitles);
    const PokemonPageLabels = t(LanguageKeys.Commands.Websearch.PokemonDexSelectPages);

    const externalResourceData = [
        isMissingno(pokeDetails)
            ? '[Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/MissingNo.)'
            : `[Bulbapedia](${parseBulbapediaURL(pokeDetails.bulbapediaPage)} )`,
        isMissingno(pokeDetails) ? '[Serebii](https://www.serebii.net/pokedex/000.shtml)' : `[Serebii](${pokeDetails.serebiiPage})`,
        isMissingno(pokeDetails) ? undefined : `[Smogon](${pokeDetails.smogonPage})`
    ]
        .filter(a => Boolean(a))
        .join(' | ');

    const display = new PaginatedMessage({
        template: new MessageEmbed()
            .setColor(resolveColor(pokeDetails.color))
            .setAuthor({ name: `#${pokeDetails.num} - ${PokemonEnumToString(pokeDetails.key)}` })
            .setThumbnail(pokeDetails[spriteToGet])
    }) //
        .setSelectMenuOptions(pageIndex => ({ label: PokemonPageLabels[pageIndex - 1] }))
        .addPageEmbed(embed => {
            embed
                .addField(t(`${LanguageKeys.Commands.Websearch.PokemonTitles}.type`, { count: pokeDetails.types.length }), pokeDetails.types.join(', '), true)
                .addField(titles.abilities, t(LanguageKeys.Globals.And, { value: abilities }), true)
                .addField(titles.gender, parseGenderRatio(pokeDetails.gender), true)
                .addField(titles.evolutions, evoChain)
                .addField(
                    titles.baseStats,
                    `${baseStats.join(', ')} (${italic(titles.baseStatsTotal)}: ${bold(t(LanguageKeys.Globals.Number, { value: pokeDetails.baseStatsTotal }))})`
                );

            if (!isCapPokemon(pokeDetails)) {
                embed.addField(titles.external, externalResourceData);
            }

            return embed;
        })
        .addPageEmbed(embed => {
            embed //
                .addField(titles.height, `${pokeDetails.height}m`, true) //
                .addField(titles.weight, `${pokeDetails.weight}kg`, true);

            if (isRegularPokemon(pokeDetails)) {
                if (pokeDetails.levellingRate) {
                    embed.addField(titles.levelingRate, pokeDetails.levellingRate, true);
                }
            }

            if (!isMissingno(pokeDetails)) {
                embed.addField(titles.eggGroups, t(LanguageKeys.Globals.And, { value: pokeDetails.eggGroups }) || '', true);
            }

            if (isRegularPokemon(pokeDetails)) {
                embed.addField(titles.eggObtainable, pokeDetails.isEggObtainable ? 'Yes' : 'No', true);

                if (!isNullish(pokeDetails.minimumHatchTime) && !isNullish(pokeDetails.maximumHatchTime)) {
                    embed
                        .addField(titles.minHatch, t(LanguageKeys.Globals.Number, { value: pokeDetails.minimumHatchTime }), true)
                        .addField(titles.maxHatch, t(LanguageKeys.Globals.Number, { value: pokeDetails.maximumHatchTime }), true);
                }

                embed.addField(titles.external, externalResourceData);
            }

            return embed;
        });

    if (!isMissingno(pokeDetails)) {
        display.addPageEmbed(embed => {
            embed //
                .addField(titles.smogon, pokeDetails.smogonTier === 'Undiscovered' ? t(LanguageKeys.Commands.Websearch.PokemonDexSmogonUnknown) : pokeDetails.smogonTier)
                .addField(titles.ev, t(LanguageKeys.Globals.And, { value: evYields }));

            if (isRegularPokemon(pokeDetails)) {
                embed.addField(titles.external, externalResourceData);
            }

            return embed;
        });
    }

    if (!isCapPokemon(pokeDetails)) {
        if (pokeDetails.flavorTexts.length) {
            display.addPageEmbed(embed => {
                embed.addField(
                    t(`${LanguageKeys.Commands.Websearch.PokemonTitles}.dex`, { count: pokeDetails.flavorTexts.length }),
                    pokeDetails.flavorTexts.map(flavor => `• (${inlineCode(flavor.game)}) ${flavor.flavor}`).join('\n')
                );

                return embed.addField(titles.external, externalResourceData);
            });
        }
    }

    if (!isMissingno(pokeDetails)) {
        // If there are any cosmetic formes or other formes then add a page for them
        // If the pokémon doesn't have the formes then the API will default them to `null`
        if (!isNullishOrEmpty(pokeDetails.otherFormes) || !isNullishOrEmpty(pokeDetails.cosmeticFormes)) {
            display.addPageEmbed(embed => {
                // If the pokémon has other formes
                if (!isNullishOrEmpty(pokeDetails.otherFormes)) {
                    const formes = pokeDetails.otherFormes.map(forme => inlineCode(PokemonEnumToString(forme as PokemonEnum)));
                    embed.addField(titles.other, t(LanguageKeys.Globals.And, { value: formes }));
                }

                // If the pokémon has cosmetic formes
                if (!isNullishOrEmpty(pokeDetails.cosmeticFormes)) {
                    const formes = pokeDetails.cosmeticFormes.map(forme => inlineCode(PokemonEnumToString(forme as PokemonEnum)));
                    embed.addField(titles.cosmetic, t(LanguageKeys.Globals.And, { value: formes }));
                }

                // Add the external resource field
                embed.addField(titles.external, externalResourceData);

                return embed;
            });
        }
    }

    return display;
}

function isCapPokemon(pokeDetails: Pokemon) {
    return pokeDetails.num < 0;
}

function isRegularPokemon(pokeDetails: Pokemon) {
    return pokeDetails.num > 0;
}

function isMissingno(pokeDetails: Pokemon) {
    return pokeDetails.num === 0;
}

/**
 * Constructs a link in the evolution chain
 * @param key Enum key of the pokemon that the evolution goes to
 * @param level Level the evolution happens
 * @param evoChain The current evolution chain
 * @param isEvo Whether this is an evolution or pre-evolution
 */
function constructEvoLink(key: Pokemon['key'], level: Pokemon['evolutionLevel'], evoChain: string, isEvo = true) {
    if (isEvo) {
        return `${evoChain} → ${inlineCode(key)} ${level ? `(${level})` : ''}`;
    }
    return `${inlineCode(PokemonEnumToString(key))} ${level ? `(${level})` : ''} → ${evoChain}`;
}

/**
 * Parse the gender ratios to an embeddable format
 */
function parseGenderRatio(genderRatio: Gender) {
    if (genderRatio.male === '0%' && genderRatio.female === '0%') {
        return 'Genderless';
    }

    return `${genderRatio.male} ${Emojis.Male} | ${genderRatio.female} ${Emojis.Female}`;
}

/**
 * Parses abilities to an embeddable format
 * @remark required to distinguish hidden abilities from regular abilities
 * @returns an array of abilities
 */
function getAbilities(abilitiesData: Abilities): string[] {
    const abilities: string[] = [];
    for (const [type, ability] of Object.entries(abilitiesData)) {
        if (!ability) continue;
        abilities.push(type === 'hidden' ? `${italic(ability)}` : ability);
    }

    return abilities;
}

/**
 * Parses base stats to an embeddable format
 * @returns an array of stats with their keys and values
 */
function getBaseStats(statsData: Stats): string[] {
    const baseStats: string[] = [];
    for (const [stat, value] of Object.entries(statsData)) {
        baseStats.push(`${StatsEnum[stat as keyof Omit<Stats, '__typename'>]}: ${bold(value.toString())}`);
    }

    return baseStats;
}

/**
 * Parses EV yields to an embeddable format
 * @returns an array of ev yields with their keys and values
 */
function getEvYields(evYieldsData: EvYields): string[] {
    const evYields: string[] = [];
    for (const [stat, value] of Object.entries(evYieldsData)) {
        evYields.push(`${StatsEnum[stat as keyof Omit<EvYields, '__typename'>]}: ${bold(value.toString())}`);
    }

    return evYields;
}

/**
 * Parses the evolution chain to an embeddable format
 * @returns The evolution chain for the Pokémon
 */
function getEvoChain(pokeDetails: Pokemon): string {
    // Set evochain if there are no evolutions
    let evoChain = bold(`${PokemonEnumToString(pokeDetails.key)} ${pokeDetails.evolutionLevel ? `(${pokeDetails.evolutionLevel})` : ''}`) as string;
    if (!pokeDetails.evolutions?.length && !pokeDetails.preevolutions?.length) {
        evoChain += ' (No Evolutions)';
    }

    // Parse pre-evolutions and add to evochain
    if (pokeDetails.preevolutions?.length) {
        const { evolutionLevel } = pokeDetails.preevolutions[0];
        evoChain = constructEvoLink(pokeDetails.preevolutions[0].key, evolutionLevel, evoChain, false);

        // If the direct pre-evolution has another pre-evolution (charizard -> charmeleon -> charmander)
        if (pokeDetails.preevolutions[0].preevolutions?.length) {
            evoChain = constructEvoLink(pokeDetails.preevolutions[0].preevolutions[0].key, null, evoChain, false);
        }
    }

    // Parse evolution chain and add to evochain
    if (pokeDetails.evolutions?.length) {
        evoChain = constructEvoLink(pokeDetails.evolutions[0].key, pokeDetails.evolutions[0].evolutionLevel, evoChain);

        // In case there are multiple evolutionary paths
        const otherFormeEvos = pokeDetails.evolutions.slice(1);
        if (otherFormeEvos.length) {
            evoChain = `${evoChain}, ${otherFormeEvos.map(oevo => `${inlineCode(oevo.species)} (${oevo.evolutionLevel})`).join(', ')}`;
        }

        // If the direct evolution has another evolution (charmander -> charmeleon -> charizard)
        if (pokeDetails.evolutions[0].evolutions?.length) {
            evoChain = constructEvoLink(
                pokeDetails.evolutions[0].evolutions[0].key, //
                pokeDetails.evolutions[0].evolutions[0].evolutionLevel,
                evoChain
            );
        }
    }

    return evoChain;
}

/**
 * Parses PokéDex colours to Discord MessageEmbed colours
 * @param colour The colour to parse
 * @license MIT
 * @Copyright Favware 2021
 */
export function resolveColor(colour: string) {
    switch (colour) {
        case 'Black':
            return 0x323232;
        case 'Blue':
            return 0x257cff;
        case 'Brown':
            return 0xa3501a;
        case 'Gray':
            return 0x969696;
        case 'Green':
            return 0x3eff4e;
        case 'Pink':
            return 0xff65a5;
        case 'Purple':
            return 0xa63de8;
        case 'Red':
            return 0xff3232;
        case 'White':
            return 0xe1e1e1;
        case 'Yellow':
            return 0xfff359;
        default:
            return 0xff0000;
    }
}

const megaRegex = /^(?<name>[a-z]+)(?:mega)$/;
const gmaxRegex = /^(?<name>[a-z]+)(?:gmax)$/;

export function PokemonEnumToString(name: PokemonEnum) {
    switch (name) {
        // other mons that can't be matched with regex.
        case PokemonEnum.Shayminsky:
            return 'Shaymin Sky';
        case PokemonEnum.Yanmega:
            return 'Yanmega';
        // lets go pikachu and eevee forms.
        case PokemonEnum.Eeveestarter:
            return 'Eevee (Starter)';
        case PokemonEnum.Pikachustarter:
            return 'Pikachu (Starter)';
        default: {
            const megaResult = megaRegex.exec(name);

            if (megaResult !== null && megaResult.groups?.name) {
                return `Mega ${toTitleCase(megaResult.groups?.name)}`;
            }

            const gmaxResult = gmaxRegex.exec(name);

            if (gmaxResult !== null && gmaxResult.groups?.name) {
                return `G-Max ${toTitleCase(gmaxResult.groups?.name)}`;
            }

            return toTitleCase(name);
        }
    }
}

const mega = /Mega (?<name>[A-z]+)/;
const gmax = /G-Max (?<name>[A-z]+)/;
const starter = /(?<name>[A-z]+) \(Starter\)/;

export function cleanFormattedPokemonName(name: string): PokemonEnum {
    const megaResult = mega.exec(name);

    if (megaResult && megaResult.groups?.name) {
        return `${megaResult.groups.name.toLowerCase()}mega` as PokemonEnum;
    }

    const gmaxResult = gmax.exec(name);

    if (gmaxResult && gmaxResult.groups?.name) {
        return `${gmaxResult.groups.name.toLowerCase()}gmax` as PokemonEnum;
    }

    const starterResult = starter.exec(name);

    if (starterResult && starterResult.groups?.name) {
        return `${starterResult.groups.name.toLowerCase()}starter` as PokemonEnum;
    }

    return name.toLowerCase().replace(/[^a-z]/, '') as PokemonEnum;
}
