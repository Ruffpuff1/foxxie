const axios = require('axios') 
const Discord = require('discord.js')
module.exports = {
    name: 'fox',
    aliases: ['ruffy', 'foxy'],
    usage: 'fox fox',
    category: 'fun',
    execute: async(props) => {

      let { message, lang, language } = props

      let loading = await language.send("MESSAGE_LOADING", lang);

      axios.get(`https://randomfox.ca/floof/`)
      .then((res) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(language.get("COMMAND_FOX_TITLE", lang))
            .setColor(message.guild.me.displayColor)
            .setImage(res.data.image)
            .setFooter(language.get("COMMAND_FOX_FOOTER", lang))
            .setTimestamp()
        message.channel.send(embed)
        loading.delete()
      })
      .catch((err) => {
          console.error(err)
      })
    }
}