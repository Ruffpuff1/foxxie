const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'cat',
    aliases: ['kitty', 'pussy'],
    usage: 'fox cat',
    category: 'fun',
    execute: async(props) => {

        let { message, lang, language } = props

        let loading = await message.channel.send(language.get("MESSAGE_LOADING", 'en-US'))
       axios.get(`https://api.thecatapi.com/v1/images/search`)
        .then((res) => {
            const embed = new Discord.MessageEmbed()
            .setTitle(language.get("COMMAND_CAT_TITLE", "en-US"))
            .setColor(message.guild.me.displayColor)
            .setImage(res.data[0].url)
            .setFooter(language.get("COMMAND_CAT_FOOTER", "en-US"))
            .setTimestamp()

            message.channel.send(embed)
            loading.delete()
        })
        .catch((err) => {
            console.error(err)
        })
    }
}