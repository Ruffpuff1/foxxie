const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'cat',
    aliases: ['kitty', 'pussy'],
    usage: 'fox cat',
    category: 'fun',
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