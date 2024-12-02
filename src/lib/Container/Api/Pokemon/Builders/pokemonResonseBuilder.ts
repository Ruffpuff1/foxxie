import { Abilities, EvYields, Gender, Pokemon, PokemonEnum, Stats } from '@favware/graphql-pokemon';
import {
    isCapPokemon,
    isMissingNoOrM00,
    isRegularPokemon,
    pokemonEnumToSpecies,
    resolveBulbapediaURL,
    resolveColor,
    resolveSerebiiUrl
} from '@favware/graphql-pokemon/utilities';
import { FavouredEntry, KeysContaining } from '../utils';
import {
    APIButtonComponentWithURL,
    APISelectMenuOption,
    ApplicationCommandOptionChoiceData,
    bold,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    inlineCode,
    italic
} from 'discord.js';
import { PaginatedMessage, PaginatedMessageAction } from '@sapphire/discord.js-utilities';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { TFunction } from 'i18next';
import { LanguageKeys } from '#lib/I18n/index';
import { Emojis } from '#lib/util/constants';

enum StatsEnum {
    hp = 'HP',
    attack = 'ATK',
    defense = 'DEF',
    specialattack = 'SPA',
    specialdefense = 'SPD',
    speed = 'SPE'
}

export type PokeDetails = Omit<Pokemon, '__typename'>;

export class PokemonResponseBuilder {
    private pokeDetails: PokeDetails;

    private spriteToGet: PokemonSpriteTypes;

    private t: TFunction;

    private abilities: string[];

    private baseStats: string[];

    private evYields: string[];

    private evoChain: string;

    public constructor(pokeDetails: PokeDetails, spriteToGet: PokemonSpriteTypes, t: TFunction) {
        this.pokeDetails = pokeDetails;
        this.spriteToGet = spriteToGet;
        this.t = t;

        this.getAbilities(pokeDetails.abilities);
        this.getBaseStats(pokeDetails.baseStats);
        this.getEvYields(pokeDetails.evYields);
        this.getEvoChain(pokeDetails);
    }

    public build(): PaginatedMessage {
        const titles = this.t(LanguageKeys.Commands.Websearch.PokemonTitles);
        const pageLabels = this.t(LanguageKeys.Commands.Websearch.PokemonDexSelectPages);

        const display = new PaginatedMessage({
            template: new EmbedBuilder()
                .setColor(resolveColor(this.pokeDetails.color))
                .setAuthor({
                    name: `#${this.pokeDetails.num} - ${pokemonEnumToSpecies(this.pokeDetails.key)}`,
                    iconURL: this.pokeDetails[this.spriteToGet]
                })
                .setThumbnail(this.pokeDetails[this.spriteToGet])
        })
            .addActions(this.parseExternalResources(this.pokeDetails))
            .setSelectMenuOptions(pageIndex => ({ label: pageLabels[pageIndex - 1] }))
            .addPageEmbed(embed => {
                embed.addFields(
                    {
                        name: this.t(`${LanguageKeys.Commands.Websearch.PokemonTitles}.type`, {
                            count: this.pokeDetails.types.length
                        }),
                        value: this.pokeDetails.types.map(type => type.name).join(', '),
                        inline: true
                    },
                    {
                        name: titles.abilities,
                        value: this.t(LanguageKeys.Globals.And, { value: this.abilities }),
                        inline: true
                    },
                    {
                        name: titles.gender,
                        value: this.parseGenderRatio(this.pokeDetails.gender),
                        inline: true
                    },
                    {
                        name: titles.evolutions,
                        value: this.evoChain
                    },
                    {
                        name: titles.baseStats,
                        value: `${this.baseStats.join(', ')} (${italic('BST')}: ${bold(this.pokeDetails.baseStatsTotal.toString())})`
                    }
                );

                return embed;
            })
            .addPageEmbed(embed => {
                embed.addFields(
                    {
                        name: titles.height,
                        value: `${this.t(LanguageKeys.Globals.NumberFormat, { value: this.pokeDetails.height })}m`,
                        inline: true
                    },
                    {
                        name: titles.weight,
                        value: `${this.t(LanguageKeys.Globals.NumberFormat, { value: this.pokeDetails.weight })}kg`,
                        inline: true
                    }
                );

                if (isRegularPokemon(this.pokeDetails)) {
                    if (this.pokeDetails.levellingRate) {
                        embed.addFields({
                            name: titles.levelingRate,
                            value: this.pokeDetails.levellingRate,
                            inline: true
                        });
                    }
                }

                if (!isMissingNoOrM00(this.pokeDetails)) {
                    embed.addFields({
                        name: titles.eggGroups,
                        value: this.pokeDetails.eggGroups?.join(', ') || '',
                        inline: true
                    });
                }

                if (isRegularPokemon(this.pokeDetails)) {
                    embed.addFields({
                        name: titles.eggObtainable,
                        value: this.pokeDetails.isEggObtainable
                            ? this.t(LanguageKeys.Globals.Yes)
                            : this.t(LanguageKeys.Globals.No),
                        inline: true
                    });

                    if (!isNullish(this.pokeDetails.minimumHatchTime) && !isNullish(this.pokeDetails.maximumHatchTime)) {
                        embed.addFields(
                            {
                                name: titles.minHatch,
                                value: this.t(LanguageKeys.Globals.NumberFormat, {
                                    value: this.pokeDetails.minimumHatchTime
                                }),
                                inline: true
                            },
                            {
                                name: titles.maxHatch,
                                value: this.t(LanguageKeys.Globals.NumberFormat, {
                                    value: this.pokeDetails.maximumHatchTime
                                }),
                                inline: true
                            }
                        );
                    }
                }

                return embed;
            });

        if (!isMissingNoOrM00(this.pokeDetails)) {
            display.addPageEmbed(embed => {
                embed //
                    .addFields(
                        {
                            name: titles.smogon,
                            value:
                                this.pokeDetails.smogonTier === 'Undiscovered'
                                    ? this.t(LanguageKeys.Commands.Websearch.PokemonDexSmogonUnknown)
                                    : this.pokeDetails.smogonTier
                        },
                        {
                            name: titles.ev,
                            value: `${this.evYields.join(', ')}`
                        }
                    );

                return embed;
            });
        }

        if (!isCapPokemon(this.pokeDetails)) {
            if (this.pokeDetails.flavorTexts.length) {
                display.addPageEmbed(embed => {
                    for (const flavor of this.pokeDetails.flavorTexts) {
                        embed.addFields({ name: titles.dex, value: `(${inlineCode(flavor.game)}) ${flavor.flavor}` });
                    }

                    return embed;
                });
            }
        }

        if (!isMissingNoOrM00(this.pokeDetails)) {
            // If there are any cosmetic formes or other formes then add a page for them
            // If the pokémon doesn't have the formes then the API will default them to `null`
            if (!isNullishOrEmpty(this.pokeDetails.otherFormes) || !isNullishOrEmpty(this.pokeDetails.cosmeticFormes)) {
                display.addPageEmbed(embed => {
                    // If the pokémon has other formes
                    if (!isNullishOrEmpty(this.pokeDetails.otherFormes)) {
                        const formes = this.pokeDetails.otherFormes.map(forme =>
                            inlineCode(pokemonEnumToSpecies(forme as PokemonEnum))
                        );
                        embed.addFields({
                            name: titles.other,
                            value: this.t(LanguageKeys.Globals.And, { value: formes })
                        });
                    }

                    // If the pokémon has cosmetic formes
                    if (!isNullishOrEmpty(this.pokeDetails.cosmeticFormes)) {
                        const formes = this.pokeDetails.cosmeticFormes.map(forme =>
                            inlineCode(pokemonEnumToSpecies(forme as PokemonEnum))
                        );
                        embed.addFields({
                            name: titles.cosmetic,
                            value: this.t(LanguageKeys.Globals.And, { value: formes })
                        });
                    }

                    return embed;
                });
            }
        }

        return display;
    }

    private getAbilities(abilitiesData: Abilities) {
        const abilities: string[] = [];
        for (const [type, ability] of Object.entries(abilitiesData)) {
            if (!ability) continue;
            abilities.push(type === 'hidden' ? `${italic(ability.name)}` : ability.name);
        }

        this.abilities = abilities;
    }

    private getBaseStats(statsData: Stats) {
        const baseStats: string[] = [];
        for (const [stat, value] of Object.entries(statsData)) {
            baseStats.push(`${StatsEnum[stat as keyof Omit<Stats, '__typename'>]}: ${bold(value.toString())}`);
        }

        this.baseStats = baseStats;
    }

    private getEvYields(evYieldsData: EvYields) {
        const evYields: string[] = [];
        for (const [stat, value] of Object.entries(evYieldsData)) {
            evYields.push(`${StatsEnum[stat as keyof Omit<EvYields, '__typename'>]}: ${bold(value.toString())}`);
        }

        this.evYields = evYields;
    }

    private getEvoChain(pokeDetails: Pokemon) {
        // Set evochain if there are no evolutions
        let evoChain = bold(
            `${pokemonEnumToSpecies(pokeDetails.key)} ${pokeDetails.evolutionLevel ? `(${pokeDetails.evolutionLevel})` : ''}`
        ) as string;
        if (!pokeDetails.evolutions?.length && !pokeDetails.preevolutions?.length) {
            evoChain += ' (No Evolutions)';
        }

        // Parse pre-evolutions and add to evochain
        if (pokeDetails.preevolutions?.length) {
            const { evolutionLevel } = pokeDetails.preevolutions[0];
            evoChain = this.constructEvoLink(pokeDetails.preevolutions[0].key, evolutionLevel, evoChain, false);

            // If the direct pre-evolution has another pre-evolution (charizard -> charmeleon -> charmander)
            if (pokeDetails.preevolutions[0].preevolutions?.length) {
                evoChain = this.constructEvoLink(pokeDetails.preevolutions[0].preevolutions[0].key, null, evoChain, false);
            }
        }

        // Parse evolution chain and add to evochain
        if (pokeDetails.evolutions?.length) {
            evoChain = this.constructEvoLink(pokeDetails.evolutions[0].key, pokeDetails.evolutions[0].evolutionLevel, evoChain);

            // In case there are multiple evolutionary paths
            const otherFormeEvos = pokeDetails.evolutions.slice(1);
            if (otherFormeEvos.length) {
                evoChain = `${evoChain}, ${otherFormeEvos.map(oevo => `${inlineCode(oevo.species)} (${oevo.evolutionLevel})`).join(', ')}`;
            }

            // If the direct evolution has another evolution (charmander -> charmeleon -> charizard)
            if (pokeDetails.evolutions[0].evolutions?.length) {
                evoChain = this.constructEvoLink(
                    pokeDetails.evolutions[0].evolutions[0].key, //
                    pokeDetails.evolutions[0].evolutions[0].evolutionLevel,
                    evoChain
                );
            }
        }

        this.evoChain = evoChain;
    }

    private constructEvoLink(key: Pokemon['key'], level: Pokemon['evolutionLevel'], evoChain: string, isEvo = true) {
        if (isEvo) {
            return `${evoChain} → ${inlineCode(pokemonEnumToSpecies(key))} ${level ? `(${level})` : ''}`;
        }
        return `${inlineCode(pokemonEnumToSpecies(key))} ${level ? `(${level})` : ''} → ${evoChain}`;
    }

    private parseExternalResources(pokeDetails: PokeDetails): PaginatedMessageAction[] {
        const smogonButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Smogon')
            .setEmoji({ id: Emojis.Smogon })
            .setURL(pokeDetails.smogonPage)
            .toJSON() as APIButtonComponentWithURL;

        if (isCapPokemon(pokeDetails)) return [smogonButton];

        const paginatedMessageActions = [
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Bulbapedia')
                .setEmoji({ id: Emojis.Bulbapedia })
                .setURL(resolveBulbapediaURL(pokeDetails))
                .toJSON() as APIButtonComponentWithURL,
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Serebii')
                .setEmoji({ id: Emojis.Serebii })
                .setURL(resolveSerebiiUrl(pokeDetails))
                .toJSON() as APIButtonComponentWithURL
        ];

        if (isRegularPokemon(pokeDetails)) {
            paginatedMessageActions.push(smogonButton);
        }

        return paginatedMessageActions;
    }

    /**
     * Parse the gender ratios to an embeddable format
     */
    private parseGenderRatio(genderRatio: Gender) {
        if (genderRatio.male === '0%' && genderRatio.female === '0%') {
            return 'Genderless';
        }

        return `${genderRatio.male} ${Emojis.MaleSignEmoji} | ${genderRatio.female} ${Emojis.FemaleSignEmoji}`;
    }
}

export type PokemonSpriteTypes = keyof Pick<Pokemon, KeysContaining<Pokemon, 'sprite'>>;

export function fuzzyPokemonToSelectOption<L extends 'name' | 'label'>(
    fuzzyMatch: Pokemon | FavouredEntry<PokemonEnum>,
    labelLikeKey: L
): L extends 'name' ? ApplicationCommandOptionChoiceData : APISelectMenuOption {
    const label = isFavouredEntry(fuzzyMatch) ? fuzzyMatch.name : pokemonEnumToSpecies(fuzzyMatch.key);

    // @ts-expect-error TS is not able to infer that `labelLikeKey` is 'name' | 'label'
    return { [labelLikeKey]: label, value: fuzzyMatch.key };
}

function isFavouredEntry(fuzzyMatch: Pokemon | FavouredEntry<PokemonEnum>): fuzzyMatch is FavouredEntry<PokemonEnum> {
    return (fuzzyMatch as FavouredEntry<PokemonEnum>).name !== undefined;
}
