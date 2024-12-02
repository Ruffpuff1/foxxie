import { gql } from '@ruffpuff/utilities';

export const getPokemon = gql`
    fragment flavors on Flavor {
        game
        flavor
    }

    fragment ability on Ability {
        name
    }

    fragment abilities on Abilities {
        first {
            ...ability
        }
        second {
            ...ability
        }
        hidden {
            ...ability
        }
        special {
            ...ability
        }
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
        types {
            name
        }
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

    query GetPokemon($pokemon: PokemonEnum!) {
        getPokemon(pokemon: $pokemon, takeFlavorTexts: 2) {
            ...pokemon
            ...evolutions
        }
    }
`;

export const getFuzzyPokemon = gql`
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
