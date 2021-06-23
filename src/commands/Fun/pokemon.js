const axios = require('axios');
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

        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.replace(/\-shiny\s*|-s\s*/, '')}/`).catch(() => {
            msg.responder.error('COMMAND_POKEMON_INVALID');
            return loading.delete();
        })

        const embed = new MessageEmbed()
            .setTitle(`${Util.toTitleCase(res.data?.name || pokemon)} (ID: ${res.data?.id})`)
            .setThumbnail(res.data?.sprites[`${shiny ? 'front_shiny' : 'front_default'}`])
            .setColor(msg.guild.me.displayColor)
            .addField(`:scroll: ${msg.language.get('COMMAND_POKEMON_TYPE')}`, res.data?.types[0].type['name'], true)
            .addField(zws, zws, true)
            .addField(zws, zws, true)
            .addField(`:scales: ${msg.language.get('COMMAND_POKEMON_WEIGHT')}`, res.data?.weight, true)
            .addField(`:straight_ruler: ${msg.language.get('COMMAND_POKEMON_HEIGHT')}`, res.data?.height.toLocaleString(), true)
            .addField(`:up: ${msg.language.get('COMMAND_POKEMON_BASEXP')}`, res.data?.base_experience, true)
            .addField(`:boot: ${msg.language.get('COMMAND_POKEMON_SPEED')}`, res.data?.stats[5]['base_stat'], true)
            .addField(`:chains: ${msg.language.get('COMMAND_POKEMON_SPECIALDEFENSE')}`, res.data?.stats[4]['base_stat'], true)
            .addField(`:crystal_ball: ${msg.language.get('COMMAND_POKEMON_SPECIALATTACK')}`, res.data?.stats[3]['base_stat'], true)
            .addField(`:shield: ${msg.language.get('COMMAND_POKEMON_DEFENSE')}`, res.data?.stats[2]['base_stat'], true)
            .addField(`:crossed_swords: ${msg.language.get('COMMAND_POKEMON_ATTACK')}`, res.data?.stats[1]['base_stat'], true)
            .addField(':heart: HP', res.data?.stats[0]['base_stat'], true)

        msg.channel.send(embed);
        loading.delete();
    }
}