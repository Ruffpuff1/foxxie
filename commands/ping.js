const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Shows the latency of the bot.',
    aliases: ['pong', 'pimg'],
    execute(message) {
      let Embed = new Discord.MessageEmbed()
      Embed.setTitle(`Fokushi's Ping`)
      Embed.setDescription(`:ping_pong: Latency is ${Date.now() - message.createdTimestamp} ms`)
      Embed.setTimestamp()
      Embed.setThumbnail(`https://images-ext-1.discordapp.net/external/lwJGAWKFCzOo0GwYPM9kVrT92uypza070vnT9Y9V5QA/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/827514096865509386/0b6bcef7c10695b00e97d416c0e70c99.png?width=586&height=586`)
      Embed.setColor("#f59dcc")
  message.channel.send(Embed)
     }
  }