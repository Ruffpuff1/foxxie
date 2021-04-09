const axios = require('axios')
const { emojis: { infinity } } = require('../../../lib/util/constants')
const Discord = require('discord.js')
module.exports = {
    name: 'cat',
    aliases: ['kitty', 'pussy'],
    description: 'Gets a random image of a cat using api.thecatapi.com.',
    usage: 'fox cat',
    guildOnly: true,
    execute: async(lang, message, args, client) => {
        message.channel.send(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {
       axios.get(`https://api.thecatapi.com/v1/images/search`)
        .then((res) => {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Random Cat:`)
            .setColor(message.guild.me.displayColor)
            .setImage(res.data[0].url)
            .setFooter(`From api.thecatapi.com`)
            .setTimestamp()
            message.channel.send(embed)
            resultMessage.delete()
        })
        .catch((err) => {
            console.error(err)
        })
        })
    }
}