const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'dog',
    aliases: ['puppy'],
    usage: 'fox dog',
    category: 'fun',
    execute: async(props) => {

        let { message, lang, language } = props

        let loading = await language.send("MESSAGE_LOADING", 'en-US');

        axios.get(`https://dog.ceo/api/breeds/image/random`)
        .then((res) => {
            const embed = new Discord.MessageEmbed()
            .setTitle(language.get("COMMAND_DOG_TITLE", lang))
            .setColor(message.guild.me.displayColor)
            .setImage(res.data.message)
            .setFooter(language.get("COMMAND_DOG_FOOTER", lang))
            .setTimestamp()
            message.channel.send(embed)
            loading.delete()
        })
        .catch((err) => {
            console.error(err)
        })
    }
}