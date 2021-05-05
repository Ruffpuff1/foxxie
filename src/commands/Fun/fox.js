const axios = require('axios') 
const Discord = require('discord.js')
module.exports = {
    name: 'fox',
    aliases: ['ruffy', 'foxxie', 'foxy'],
    usage: 'fox fox',
    category: 'fun',
    execute: async(props) => {

      let { message, lang, language } = props

      message.channel.send(language.get("MESSAGE_LOADING", 'en-US')).then(resultMessage => {
      axios.get(`https://randomfox.ca/floof/`)
      .then((res) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(language.get("COMMAND_FOX_TITLE", "en-US"))
            .setColor(message.guild.me.displayColor)
            .setImage(res.data.image)
            .setFooter(language.get("COMMAND_FOX_FOOTER", "en-US"))
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