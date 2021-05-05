const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'pokemon',
    aliases: ['pkm', 'poke'],
    usage: 'fox pokemon [pokemon] (-s|-shiny)',
    category: 'fun',
    execute: async(props) => {

        let { message, args, lang, language } = props

        if (!args[0]) return message.channel.send(language.get('COMMAND_POKEMON_NOPOKEMON', 'en-US'))
        const pokemon = args[0]
        
        let loading = await message.channel.send(language.get("MESSAGE_LOADING", 'en-US'))

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
                        name: `:scroll: ${language.get('COMMAND_POKEMON_FIELD_TYPE', 'en-US')}`,
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
                        name: `:scales: ${language.get('COMMAND_POKEMON_FIELD_WEIGHT', 'en-US')}`,
                        value: res.data.weight,
                        inline: true
                    },
                    {
                        name: `:straight_ruler: ${language.get('COMMAND_POKEMON_FIELD_HEIGHT', 'en-US')}`,
                        value: res.data.height.toLocaleString(),
                        inline: true
                    },
                    {
                        name: `:up: ${language.get('COMMAND_POKEMON_FIELD_BASEXP', 'en-US')}`,
                        value: res.data.base_experience,
                        inline: true
                    },
                    {
                        name: `:boot: ${language.get('COMMAND_POKEMON_FIELD_SPEED', 'en-US')}`,
                        value: res.data.stats[5]['base_stat'],
                        inline: true
                    },
                    {
                        name: `:chains: ${language.get('COMMAND_POKEMON_FIELD_SPECIALDEF', 'en-US')}`,
                        value: res.data.stats[4]['base_stat'],
                        inline: true
                    },
                    {
                        name: `:crystal_ball: ${language.get('COMMAND_POKEMON_FIELD_SPECIALATTK', 'en-US')}`,
                        value: res.data.stats[3]['base_stat'],
                        inline: true
                    },
                    {
                        name: `:shield: ${language.get('COMMAND_POKEMON_FIELD_DEFENSE', 'en-US')}`,
                        value: res.data.stats[2]['base_stat'],
                        inline: true
                    },
                    {
                        name: `:crossed_swords: ${language.get('COMMAND_POKEMON_FIELD_ATTACK', 'en-US')}`,
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
            message.channel.send(language.get('COMMAND_POKEMON_INVALIDPOKEMON', 'en-US'))
            }
        )
    }
}