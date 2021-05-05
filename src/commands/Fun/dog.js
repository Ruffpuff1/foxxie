const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'dog',
    aliases: ['puppy'],
    usage: 'fox dog',
    category: 'fun',
    execute: async(props) => {

        let { message, lang, language } = props

        message.channel.send(language.get("MESSAGE_LOADING", 'en-US')).then(resultMessage => {
        axios.get(`https://dog.ceo/api/breeds/image/random`)
        .then((res) => {
            const embed = new Discord.MessageEmbed()
            .setTitle(language.get("COMMAND_CAT_TITLE", "en-US"))
            .setColor(message.guild.me.displayColor)
            .setImage(res.data.message)
            .setFooter(language.get("COMMAND_CAT_FOOTER", "en-US"))
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