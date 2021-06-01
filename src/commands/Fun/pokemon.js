const axios = require('axios');
const Discord = require('discord.js');
const { toUpperCaseFirst } = require('../../../lib/util/util');
const { zws } = require('../../../lib/util/constants');

module.exports = {
    name: 'pokemon',
    aliases: ['pkm', 'poke'],
    usage: 'fox pokemon [pokemon] (-s|-shiny)',
    category: 'fun',
    execute: async({ message, args: [pokemon], language }) => {

        if (!pokemon) return message.responder.error('COMMAND_POKEMON_NOPOKEMON');
        
        let loading = await message.responder.loading();
        let shiny = /\-shiny\s*|-s\s*/.test(message.content);
        
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.replace(/\-shiny\s*|-s\s*/, '')}/`).catch(() => {
            message.responder.error('COMMAND_POKEMON_INVALIDPOKEMON');
            return loading.delete();
        })

        const embed = new Discord.MessageEmbed()
            .setTitle(`${res.data?.name.toUpperCaseFirst()} (ID: ${res.data?.id})`)
            .setThumbnail(res.data?.sprites[`${shiny ? 'front_shiny' : 'front_default'}`])
            .addField(`:scroll: ${language.get('COMMAND_POKEMON_FIELD_TYPE')}`, res.data?.types[0].type['name'], true)
            .addField(zws, zws, true)
            .addField(zws, zws, true)
            .addField(`:scales: ${language.get('COMMAND_POKEMON_FIELD_WEIGHT')}`, res.data?.weight, true)
            .addField(`:straight_ruler: ${language.get('COMMAND_POKEMON_FIELD_HEIGHT')}`, res.data?.height.toLocaleString(), true)
            .addField(`:up: ${language.get('COMMAND_POKEMON_FIELD_BASEXP')}`, res.data?.base_experience, true)
            .addField(`:boot: ${language.get('COMMAND_POKEMON_FIELD_SPEED')}`, res.data?.stats[5]['base_stat'], true)
            .addField(`:chains: ${language.get('COMMAND_POKEMON_FIELD_SPECIALDEF')}`, res.data?.stats[4]['base_stat'], true)
            .addField(`:crystal_ball: ${language.get('COMMAND_POKEMON_FIELD_SPECIALATTK')}`, res.data?.stats[3]['base_stat'], true)
            .addField(`:shield: ${language.get('COMMAND_POKEMON_FIELD_DEFENSE')}`, res.data?.stats[2]['base_stat'], true)
            .addField(`:crossed_swords: ${language.get('COMMAND_POKEMON_FIELD_ATTACK')}`, res.data?.stats[1]['base_stat'], true)
            .addField(':heart: HP', res.data?.stats[0]['base_stat'], true)

        message.channel.send(embed);
        loading.delete();
    }
}