const { MessageEmbed, Channel } = require('discord.js')

module.exports = {
  name: 'ping',
  aliases: ['pong'],
  description: 'to check the bots ping.',

  callback: ({ message, client, interaction }) => {
    const embed = new MessageEmbed().setTitle(':ping_pong: Pong Counters!').setColor(3553598).addFields({
      name: '**API Latency**',
      value: '```'+`${Math.round(client.ws.ping)} ms`+'```',
      inline: true
    })

    if (message) { if (!message.author.bot) {
      const embed = new MessageEmbed().setTitle(':ping_pong: Pong Counters!').setColor(3553598).addFields({
        name: '**Bot Latency**',
        value: '```'+`${Date.now() - message.createdTimestamp} ms`+'```',
        inline: true
      }, {
        name: 'API Latency',
        value: '```'+`${Math.round(message.client.ws.ping)} ms`+'```',
        inline: true
      })	
      message.channel.send(embed)
    } }
    return embed
  },
}