const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'messageDelete',
    execute: async(message) => {
        if (message.partial) return

        let msgChn = message.client.channels.cache.get("831939859480182794")

        if (message.author.bot) return

        if (message.content?.toLowerCase() === '?pick') return

        const embed = new MessageEmbed()
            .setTitle(`Message Edited by ${message.author.tag}`)
            .setColor(message.guild.me.displayColor)
            .setDescription(`Message by ${message.author} edited in ${message.channel}.`)
            .setFooter(message.author.tag, message.author.avatarURL({dynamic: true}))
            .setTimestamp()
            .addField(`**Message ID:**`, `\`${message.id}\``, true)
            .addField(`**Content:**`, message.content, true)
            .addField(`\u200B`, `\u200B`, true)

        msgChn.send(embed)
    }
}