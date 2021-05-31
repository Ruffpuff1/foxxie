const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'dog',
    aliases: ['puppy'],
    usage: 'fox dog',
    category: 'fun',
    async execute ({ message, lang, language }) {

        let loading = await language.send("MESSAGE_LOADING", lang);
        const img = await axios.get(`https://dog.ceo/api/breeds/image/random`).catch(() => null);

        const embed = new Discord.MessageEmbed()
            .setTitle(language.get("COMMAND_DOG_TITLE", lang))
            .setColor(message.guild.me.displayColor)
            .setImage(img.data.message)
            .setFooter(language.get("COMMAND_DOG_FOOTER", lang))
            .setTimestamp()

        message.channel.send(embed);
        loading.delete();
    }
}