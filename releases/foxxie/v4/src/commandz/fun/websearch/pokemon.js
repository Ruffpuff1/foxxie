const { toTitleCase } = require('@ruffpuff/utilities');
const { Permissions: { FLAGS } } = require(`discord.js`);
const { Pokemon, PaginatedMessage } = require('#util');
const { colors } = require('#utils/Constants');
const { FoxxieCommand } = require('#structures');
const { sendLoading } = require('#messages');
const { languageKeys, t } = require('#i18n');

const BaseStats = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    specialattack: 'SPA',
    specialdefense: 'SPD',
    speed: 'SPE'
};

const parseBulbapediaURL = url => url.replace(/[ ]/g, '_').replace(/\(/g, '%28').replace(/\)/g, '%29');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['pokedex', 'dex'],
            requiredPermissions: [FLAGS.EMBED_LINKS, FLAGS.ADD_REACTIONS],
            usage: '<Pokémon:string>',
            flags: ['s', 'shiny', 'back', 'b']
        });

        this.pokemon = new Pokemon();

        this.colors = {
            bird: colors.POKEMON_BIRD
        };
    }

    async run(msg, [pokemon]) {
        const shiny = this.hasFlags(msg, ['shiny', 's']);
        const back = this.hasFlags(msg, ['back', 'b']);
        const loading = await sendLoading(msg);

        const pokemonData = await this.fetchAPI(pokemon, { shiny, msg, loading });
        await this.buildDisplay(pokemonData, { back, msg, pokemon, loading });
        return loading.delete();
    }

    async buildDisplay(pokemonDetails, { back, msg, pokemon, loading }) {
        const abilities = this.calculateAbilities(pokemonDetails);
        const baseStats = this.getBaseStats(pokemonDetails.stats);
        const evoChain = this.getEvoChain(msg, pokemonDetails);

        if (pokemonDetails.number < 0) {
            await loading.delete();
            throw t(msg, this.t.noExist, { pokemon });
        }
        return this.parseRegularPokemon({ pokemonDetails, back, abilities, baseStats, msg, evoChain });
    }

    parseRegularPokemon({ pokemonDetails, back, abilities, baseStats, msg }) {
        const titles = languageKeys.titles.websearch.pokemon;
        const externalResourceData = t(msg, this.t.externalResource, {
            bulba: parseBulbapediaURL(pokemonDetails.links.bulbapedia),
            sere: pokemonDetails.links.serebii,
            smogon: pokemonDetails.links.smogon
        });

        const actions = [PaginatedMessage.defaultActions[0], PaginatedMessage.defaultActions[2], PaginatedMessage.defaultActions[3], PaginatedMessage.defaultActions[4]];
        const display = new PaginatedMessage({ actions }).setPromptMessage(t(msg, languageKeys.system.reactionHandlerPrompt))
            .addPageEmbed(embed =>
                this.addBaseEmbed(embed, pokemonDetails, back, msg.guild.me.displayColor)
                    .addField(t(msg, titles.type, { count: pokemonDetails.types.length }), pokemonDetails.types.map(type => type).join(', '), true)
                    .addField(t(msg, titles.ability, { count: abilities.length }), abilities.join(', '), true)
                    .addField(t(msg, titles.gender), this.parseGenderRatio(msg, pokemonDetails.gender), true)
                    // .addField('evolutions', evoChain)
                    .addField(t(msg, titles.baseStats), `${baseStats} (*BST*: **${pokemonDetails.baseStatsTotal}**)`)
                    .addField(t(msg, titles.external), externalResourceData)
            )
            .addPageEmbed(embed =>
                this.addBaseEmbed(embed, pokemonDetails, back, msg.guild.me.displayColor)
                    .addField(t(msg, titles.height), `${pokemonDetails.height}m`, true)
                    .addField(t(msg, titles.weight), `${pokemonDetails.weight}kg`, true)
                    .addField(t(msg, titles.eggGroups), pokemonDetails.eggGroups?.join(', ') || t(msg, this.t.noEggGroups), true)
                    .addField(t(msg, titles.external), externalResourceData)
            )
            .addPageEmbed(embed =>
                this.addBaseEmbed(embed, pokemonDetails, back, msg.guild.me.displayColor)
                    .addField(t(msg, titles.smogon), pokemonDetails.smogonTier, true)
                    .addField(t(msg, titles.dex), `\`(${pokemonDetails.entries[0].game})\` ${pokemonDetails.entries[0].flavor}`)
                    .addField(t(msg, titles.external), externalResourceData)
            );

        if (pokemonDetails.cosmeticFormes || pokemonDetails.otherFormes) {
            display.addPageEmbed(embed => {
                this.addBaseEmbed(embed, pokemonDetails, back, msg.guild.me.displayColor);
                // If the pokémon has other formes
                if (pokemonDetails.otherFormes) {
                    embed.addField(t(msg, titles.forms), pokemonDetails.otherFormes.join(' '));
                }

                // If the pokémon has cosmetic formes
                if (pokemonDetails.cosmeticFormes) {
                    embed.addField(t(msg, titles.cosmetic), pokemonDetails.cosmeticFormes.join(' '));
                }

                // Add the external resource field
                embed.addField(t(msg, titles.external), externalResourceData);

                return embed;
            });
        }

        display.pageIndexPrefix = t(msg, languageKeys.system.footer);
        display.pages.forEach(page => display.applyFooter(page, display.pages.indexOf(page)));

        return display.run(msg);
    }

    async fetchAPI(pokemon, { shiny, msg, loading }) {
        try {
            const res = await this.pokemon.getPokemon(pokemon, shiny);
            return res;
        } catch {
            await loading.delete();
            throw t(msg, this.t.noExist, { pokemon });
        }
    }

    getBaseStats(statsData) {
        const baseStats = [];
        for (const [stat, value] of Object.entries(statsData)) {
            baseStats.push(`${BaseStats[stat]}: **${value}**`);
        }
        return baseStats.join(', ');
    }

    calculateAbilities(res) {
        return Object.values(res.abilities)
            .filter(ability => !!ability)
            .map(ability => (res.abilities.hidden === ability ? `*${ability}*` : ability));
    }

    parseGenderRatio(msg, genderRatio) {
        if (genderRatio.male === '0%' && genderRatio.female === '0%') {
            return t(msg, this.t.genderless);
        }

        return `${genderRatio.male} ♂️ | ${genderRatio.female} ♀️`;
    }

    getEvoChain(msg, pokeDetails) {
        // Set evochain if there are no evolutions
        let evoChain = `**${toTitleCase(pokeDetails.name)} ${pokeDetails.evolutionLevel ? `(${pokeDetails.evolutionLevel})` : ''}**`;
        if (!pokeDetails.evolutions?.length && !pokeDetails.preevolutions?.length) {
            evoChain += ` ${t(msg, this.t.noEvolutions)}`;
        }

        // Parse pre-evolutions and add to evochain
        if (pokeDetails.preevolutions?.length) {
            const { preevolutions: [evolutionLevel] } = pokeDetails;
            evoChain = this.constructEvoLink(pokeDetails.preevolutions[0].species, evolutionLevel, evoChain, false);

            // If the direct pre-evolution has another pre-evolution (charizard -> charmeleon -> charmander)
            if (pokeDetails.preevolutions[0].preevolutions?.length) {
                evoChain = this.constructEvoLink(pokeDetails.preevolutions[0].preevolutions[0].species, null, evoChain, false);
            }
        }

        // Parse evolution chain and add to evochain
        if (pokeDetails.evolutions?.length) {
            evoChain = this.constructEvoLink(pokeDetails.evolutions[0].species, pokeDetails.evolutions[0].evolutionLevel, evoChain);

            // In case there are multiple evolutionary paths
            const otherFormeEvos = pokeDetails.evolutions.slice(1);
            if (otherFormeEvos.length) {
                evoChain = `${evoChain}, ${otherFormeEvos.map(oevo => `\`${oevo.species}\` (${oevo.evolutionLevel})`).join(', ')}`;
            }

            // If the direct evolution has another evolution (charmander -> charmeleon -> charizard)
            if (pokeDetails.evolutions[0].evolutions?.length) {
                evoChain = this.constructEvoLink(
                    pokeDetails.evolutions[0].evolutions[0].species,
                    pokeDetails.evolutions[0].evolutions[0].evolutionLevel,
                    evoChain
                );
            }
        }

        return evoChain;
    }

    constructEvoLink(species, level, evoChain, isEvo = true) {
        if (isEvo) {
            return `${evoChain} → \`${toTitleCase(species)}\` ${level ? `(${level})` : ''}`;
        }
        return `\`${toTitleCase(species)}\` ${level ? `(${level})` : ''} → ${evoChain}`;
    }

    addBaseEmbed(embed, res, back, baseColor) {
        return embed
            .setThumbnail(res.sprites[back ? 'back' : 'front'])
            .setAuthor(`#${res.number} - ${toTitleCase(res.name)}`, res.sprites[back ? 'back' : 'front'])
            .setColor(this.colors[res.types[0]?.toLowerCase()] ?? baseColor);
    }

};