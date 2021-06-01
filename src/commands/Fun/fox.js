const axios = require('axios') 
const Discord = require('discord.js')
module.exports = {
    name: 'fox',
    aliases: ['ruffy', 'foxy'],
    usage: 'fox fox',
    category: 'fun',
    async execute ({ message, language }) {

      let loading = await message.responder.loading();
      const img = await axios.get(`https://randomfox.ca/floof/`);

      const embed = new Discord.MessageEmbed()
          .setTitle(language.get("COMMAND_FOX_TITLE"))
          .setColor(message.guild.me.displayColor)
          .setImage(img.data.image)
          .setFooter(language.get("COMMAND_FOX_FOOTER"))
          .setTimestamp()

      message.channel.send(embed);
      loading.delete();
    }
}