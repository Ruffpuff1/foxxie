const req = require('@aero/centra');
const { MessageEmbed } = require('discord.js');
const { Command, Util, zws } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'pokemon',
            aliases: ['pkm', 'poke'],
            description: language => language.get('COMMAND_POKEMON_DESCRIPTION'),
            usage: '[Pokemon] (-s)',
            category: 'fun' 
        })
    }

    async run(msg, [pokemon]) {

        if (!pokemon) return msg.responder.error('COMMAND_POKEMON_NOARGS');
        const loading = await msg.responder.loading();
        const shiny = /\-shiny\s*|-s\s*/.test(msg.content);
 
        const results = await req(`https://pokeapi.co/api/v2`)
                .path('pokemon')
                .path(pokemon.replace(/\-shiny\s*|-s\s*/, ''))
                .json()
                .then(res => res)
                .catch(() => {
                    loading.delete();
                    throw msg.language.get('COMMAND_POKEMON_INVALID');
                })

        const embed = new MessageEmbed()
            .setTitle(`${Util.toTitleCase(results.name || pokemon)} (ID: ${results.id})`)
            .setThumbnail(results.sprites[`${shiny ? 'front_shiny' : 'front_default'}`])
            .setColor(msg.guild.me.displayColor)
            .addField(`:scroll: ${msg.language.get('COMMAND_POKEMON_TYPE')}`, results.types.map(t => t.type.name).join('-'), true)
            .addField(zws, zws, true)
            .addField(zws, zws, true)
            .addField(`:scales: ${msg.language.get('COMMAND_POKEMON_WEIGHT')}`, results.weight, true)
            .addField(`:straight_ruler: ${msg.language.get('COMMAND_POKEMON_HEIGHT')}`, results.height.toLocaleString(), true)
            .addField(`:up: ${msg.language.get('COMMAND_POKEMON_BASEXP')}`, results.base_experience, true)
            .addField(`:boot: ${msg.language.get('COMMAND_POKEMON_SPEED')}`, results.stats[5]['base_stat'], true)
            .addField(`:chains: ${msg.language.get('COMMAND_POKEMON_SPECIALDEFENSE')}`, results.stats[4]['base_stat'], true)
            .addField(`:crystal_ball: ${msg.language.get('COMMAND_POKEMON_SPECIALATTACK')}`, results.stats[3]['base_stat'], true)
            .addField(`:shield: ${msg.language.get('COMMAND_POKEMON_DEFENSE')}`, results.stats[2]['base_stat'], true)
            .addField(`:crossed_swords: ${msg.language.get('COMMAND_POKEMON_ATTACK')}`, results.stats[1]['base_stat'], true)
            .addField(':heart: HP', results.stats[0]['base_stat'], true)

        msg.channel.send(embed);
        loading.delete();
    }
}