const { MessageEmbed } = require('discord.js')
const { commandHandler } = require('./commandHandler')
module.exports = {
    name: 'messageUpdate',
    execute: async(oldMessage, newMessage) => {

        if (oldMessage.partial || newMessage.partial) return

        // Prevents the bot from reading DMs
        if (newMessage.channel.type === 'dm' || oldMessage.channel.type === 'dm') return
        // Doesn't log link embed edits
        if (oldMessage.content.startsWith('https://')) return
        // Command edit with cmd handler
        const message = newMessage
        commandHandler(message)

        let msgChn = message.client.channels.cache.get("831939859480182794")

        if (message.author.bot) return

        const embed = new MessageEmbed()
            .setTitle(`Message Edited by ${message.author.tag}`)
            .setColor(message.guild.me.displayColor)
            .setDescription(`Message by ${message.author} edited in ${message.channel}.`)
            .setFooter(message.author.tag, message.author.avatarURL({dynamic: true}))
            .setTimestamp()
            .addField(`Message ID:`, `\`${message.id}\``, true)
            .addField(`Message Link:`, `[Here](${message.url})`, true)
            .addField(`\u200B`, `\u200B`, true)
            .addField(`Before:`, oldMessage.content, true)
            .addField(`After:`, message.content, true)
            .addField(`\u200B`, `\u200B`, true)

        msgChn.send(embed)
    }
}