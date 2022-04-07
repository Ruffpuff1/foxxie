const centra = require('@foxxie/centra');

class Pokemon {

    constructor() {
        this.baseURL = 'https://graphqlpokemon.favware.tech/';
    }

    async getPokemon(pokemon, shiny) {
        if (!pokemon) throw new Error('You need to provide a pokemon name');

        pokemon = pokemon
            .toLowerCase()
            .replace(/\s/g, '');

        const query = `{
                getPokemon(pokemon: ${pokemon}) {
                num
                species
                types
                color
                eggGroups
                evolutionLevel
                forme
                formeLetter
                abilities { first second hidden }
                baseStats { hp attack defense specialattack specialdefense speed }
                gender { male female }
                height
                weight
                flavorTexts { game flavor }
                sprite
                backSprite
                shinySprite
                shinyBackSprite
                smogonTier
                smogonPage
                serebiiPage
                bulbapediaPage
                cosmeticFormes
                otherFormes
                baseStatsTotal
                
                }
            }`;

        const res = await centra(this.baseURL, 'POST')
            .body({ query })
            .json()
            .catch(() => {
                return { error: `Was unable to find data for the pokemon ${pokemon}` };
            });

        if (res.error) throw res.error;
        const { getPokemon: data } = res.data;

        const result = {
            evolutionLevel: data.evolutionLevel,
            number: data.num,
            name: data.species,
            types: data.types,
            color: data.color,
            abilities: {
                first: data.abilities.first,
                second: data.abilities.second,
                hidden: data.abilities.hidden
            },
            evolutions: data.evolutions,
            preevolutions: data.preevolutions,
            evos: data.evolutions,
            prevo: data.preevolutions,
            forme: data.forme,
            formeLetter: data.formeLetter,
            eggGroups: data.eggGroups,
            stats: {
                hp: data.baseStats.hp,
                attack: data.baseStats.attack,
                defense: data.baseStats.defense,
                specialattack: data.baseStats.specialattack,
                specialdefense: data.baseStats.specialdefense,
                speed: data.baseStats.speed
            },
            baseStatsTotal: data.baseStatsTotal,
            gender: {
                male: data.gender.male,
                female: data.gender.female
            },
            height: data.height,
            weight: data.weight,
            entries: data.flavorTexts.map(entry => entry),
            smogonTier: data.smogonTier,
            links: {
                smogon: data.smogonPage,
                serebii: data.serebiiPage,
                bulbapedia: data.bulbapediaPage
            },
            cosmeticFormes: data.cosmeticFormes,
            otherFormes: data.otherFormes
        };

        result.sprites = shiny
            ? {
                front: data.shinySprite,
                back: data.shinyBackSprite
            }
            : {
                front: data.sprite,
                back: data.backSprite
            };

        return result;
    }

}

module.exports = Pokemon;