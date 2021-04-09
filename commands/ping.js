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
      Embed.setThumbnail(message.guild.iconURL())
      Embed.setColor("#f59dcc")
  message.channel.send(Embed)
     }
  }