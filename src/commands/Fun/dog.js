const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'dog',
    aliases: ['puppy'],
    description: 'Shows a random image of a dog from dog.co/api.',
    usage: 'fox dog',
    guildOnly: true,
    execute: async(lang, message, args, client) => {
        message.channel.send(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {
        axios.get(`https://dog.ceo/api/breeds/image/random`)
        .then((res) => {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Random Dog:`)
            .setColor(message.guild.me.displayColor)
            .setImage(res.data.message)
            .setFooter(`From dog.ceo/api`)
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