const axios = require('axios') 
const Discord = require('discord.js')
module.exports = {
    name: 'fox',
    aliases: ['ruffy', 'foxxie', 'foxy'],
    usage: 'fox fox',
    category: 'fun',
    execute: async(lang, message, args, client) => {
      message.channel.send(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {
      axios.get(`https://randomfox.ca/floof/`)
      .then((res) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Random Fox:`)
            .setColor(message.guild.me.displayColor)
            .setImage(res.data.image)
            .setFooter(`From randomfox.ca/floof`)
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