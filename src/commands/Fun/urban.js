const Discord = require('discord.js')
const axios = require('axios')
module.exports = {
    name: "urban",
    aliases: ['ud', 'slang'],
    usage: 'fox urban [term]',
    category: 'fun',
    execute: async (lang, message, args, client) => {
        if(!message.channel.nsfw) return message.channel.send(lang.COMMAND_NSFW_ERROR)
        if (!args[0]) return message.channel.send(lang.COMMAND_URBAN_NO_WORD)
        message.channel.send(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {
        axios.get(`http://api.urbandictionary.com/v0/define?term=$%7B${args[0]}%7D`)
        .then((res) => {

            const argCap = args[0].charAt(0).toUpperCase()  + args[0].slice(1)
            let ex = res.data.list[3]['example']
            let str = res.data.list[3]['definition']

            const embed = new Discord.MessageEmbed()
            .setTitle(argCap)
            .setURL(res.data.list[3]['permalink'])
            .setColor(message.guild.me.displayColor)
            .setThumbnail(`https://i.imgur.com/qNTzb3k.png`)
            .setDescription(`${str.replace(/[\[\]']+/g,'')}\n\n\`👍\` ${res.data.list[3]['thumbs_up']}\n\`👎\` ${res.data.list[3]['thumbs_down']}`)
            .setFooter(`By ${res.data.list[3]['author']}`)
            .addField('Example', ex.replace(/[\[\]']+/g,''))

            message.channel.send(embed)
            resultMessage.delete()

        })
            .catch((err) => {
                console.error(err)
                message.channel.send(lang.COMMAND_URBAN_NO_DATA)
            })
        })
    }
}