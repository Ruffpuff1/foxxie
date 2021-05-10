const Discord = require('discord.js')
const axios = require('axios')
module.exports = {
    name: "urban",
    aliases: ['ud', 'slang'],
    usage: 'fox urban [term]',
    category: 'fun',
    execute: async (props) => {

        let { message, args, lang, language } = props

        //if(!message.channel.nsfw) return message.channel.send(lang.COMMAND_NSFW_ERROR)
        if (!args[0]) return message.channel.send(language.get('COMMAND_URBAN_NOWORD', 'en-US'))
        let loading = await message.channel.send(language.get("MESSAGE_LOADING", 'en-US'))
        axios.get(`http://api.urbandictionary.com/v0/define?term=$%7B${args[0]}%7D`)
        .then((res) => {

            const argCap = args[0].charAt(0).toUpperCase()  + args[0].slice(1)
            let ex;
            let str;
            res.data.list[3] ? ex = res.data.list[3]['example'] : ex = language.get('COMMAND_URBAN_NODEFINITION', 'en-US')
            res.data.list[3] ? str = res.data.list[3]['definition'] : str = language.get('COMMAND_URBAN_NOEXAMPLE', 'en-US')

            const embed = new Discord.MessageEmbed()
            .setTitle(argCap)
            .setURL(res.data.list[3]['permalink'])
            .setColor(message.guild.me.displayColor)
            .setThumbnail(`https://i.imgur.com/qNTzb3k.png`)
            .setDescription(`${str.replace(/[\[\]']+/g,'')}\n\n\`👍\` ${res.data.list[3]['thumbs_up']}\n\`👎\` ${res.data.list[3]['thumbs_down']}`)
            .setFooter(language.get('COMMAND_URBAN_FOOTER', 'en-US', res))
            .addField(language.get('COMMAND_URBAN_EXAMPLE', 'en-US'), ex.replace(/[\[\]']+/g,''))

            message.channel.send(embed)
            loading.delete()

        })
            .catch((err) => {
                loading.delete()
                message.channel.send(language.get('COMMAND_URBAN_NODATA', 'en-US'))
        })
    }
}