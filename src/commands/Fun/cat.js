const axios = require('axios')
const Discord = require('discord.js')
module.exports = {
    name: 'cat',
    aliases: ['kitty', 'pussy'],
    usage: 'fox cat',
    category: 'fun',
    async execute ({ message, language }) {

        let loading = await message.responder.loading();
        const img = await axios.get(`https://api.thecatapi.com/v1/images/search`).catch(() => null);

        const embed = new Discord.MessageEmbed()
            .setTitle(language.get("COMMAND_CAT_TITLE"))
            .setColor(message.guild.me.displayColor)
            .setImage(img.data[0].url)
            .setFooter(language.get("COMMAND_CAT_FOOTER"))
            .setTimestamp()

        message.channel.send(embed);
        loading.delete();
    }
}