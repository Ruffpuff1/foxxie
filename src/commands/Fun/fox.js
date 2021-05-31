const axios = require('axios') 
const Discord = require('discord.js')
module.exports = {
    name: 'fox',
    aliases: ['ruffy', 'foxy'],
    usage: 'fox fox',
    category: 'fun',
    async execute ({ message, lang, language }) {

      let loading = await language.send("MESSAGE_LOADING", lang);
      const img = await axios.get(`https://randomfox.ca/floof/`);

      const embed = new Discord.MessageEmbed()
          .setTitle(language.get("COMMAND_FOX_TITLE", lang))
          .setColor(message.guild.me.displayColor)
          .setImage(img.data.image)
          .setFooter(language.get("COMMAND_FOX_FOOTER", lang))
          .setTimestamp()

      message.channel.send(embed);
      loading.delete();
    }
}