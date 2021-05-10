const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'messageDelete',
    execute: async(message) => {
        
        if (message.partial) return
        let deleteChannel = await message.guild.settings.get('deleteChannel')
        if (!deleteChannel) return;

        let msgChn = message.client.channels.cache.get(deleteChannel)
        if (!msgChn) return

        if (message.author.bot) return
        if (message.content.toLowerCase() === '?pick') return
        if (!message.content) return;

        const embed = new MessageEmbed()
            .setTitle(`Message Deleted by ${message.author.tag}`)
            .setColor(message.guild.me.displayColor)
            .setDescription(`Message by ${message.author} deleted in ${message.channel}.`)
            .setFooter(message.author.tag, message.author.avatarURL({dynamic: true}))
            .setTimestamp()
            .addField(`**Message ID:**`, `\`${message.id}\``, true)
            .addField(`**Content:**`, message.content, true)
            .addField(`\u200B`, `\u200B`, true)

        msgChn.send(embed)
    }
}