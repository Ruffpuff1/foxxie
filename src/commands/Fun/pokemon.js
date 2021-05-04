const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'pokemon',
    aliases: ['pkm', 'poke'],
    usage: 'fox pokemon [pokemon]',
    category: 'fun',
    execute: async(lang, message, args) => {
        if (!args[0]) return message.channel.send(`**Cmon,** you gotta enter a pokemon for me to show.`)
        const pokemon = args[0]
        
        let loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING)

        let isShine = /\-shiny\s*|-s\s*/
        let shiny = isShine.test(message.content)

        let newPokemon = pokemon.replace(isShine, '')
        
        axios.get(`https://pokeapi.co/api/v2/pokemon/${newPokemon}/`)
        .then((res) => {

            const argCap = res.data.name.charAt(0).toUpperCase() + res.data.name.slice(1)
            const embed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setTitle(`${argCap} (ID: ${res.data.id})`)
                .setThumbnail(res.data.sprites[`${shiny ? 'front_shiny' : 'front_default'}`])
                .addFields(
                    {
                        name: ':scroll: **Type**',
                        value: res.data.types[0].type['name'],
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: ':scales: **Weight**',
                        value: res.data.weight,
                        inline: true
                    },
                    {
                        name: ':straight_ruler: **Height**',
                        value: res.data.height.toLocaleString(),
                        inline: true
                    },
                    {
                        name: ':up: **Base Exp**',
                        value: res.data.base_experience,
                        inline: true
                    },
                    {
                        name: ':boot: **Speed**',
                        value: res.data.stats[5]['base_stat'],
                        inline: true
                    },
                    {
                        name: ':chains: **Special Def**',
                        value: res.data.stats[4]['base_stat'],
                        inline: true
                    },
                    {
                        name: ':crystal_ball: **Special Atk**',
                        value: res.data.stats[3]['base_stat'],
                        inline: true
                    },
                    {
                        name: ':shield: Defense',
                        value: res.data.stats[2]['base_stat'],
                        inline: true
                    },
                    {
                        name: ':crossed_swords: Attack',
                        value: res.data.stats[1]['base_stat'],
                        inline: true
                    },
                    {
                        name: ':heart: HP',
                        value: res.data.stats[0]['base_stat'],
                        inline: true
                    }
                )
            loading.delete()
            message.channel.send(embed)
        })
        .catch((err) => {
            loading.delete()
            message.channel.send(`**Hey,** that Pokemon is invalid! How bout an actual one this time oki?`)
            }
        )
    }
}