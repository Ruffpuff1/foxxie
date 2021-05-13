const Discord = require('discord.js')
module.exports = {
    name: 'testdisboard',
    aliases: ['td', 'testbump'],
    usage: 'fox testdisboard',
    permissions: 'MANAGE_MESSAGES',
    category: 'automation',
    execute: async(props) => {

        let { message, settings } = props

        const dischannel = message.guild.channels.cache.get(settings.disboardChannel)
        if (!dischannel) return

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle('Reminder to Bump')
            .setThumbnail(message.client.user.displayAvatarURL())

        embed.setDescription(settings.disboardMessage?settings.disboardMessage.replace(/{(server|guild)}/gi, message.guild.name):"Time to bump the server on disboard. Use the command `!d bump` then come back in **two hours**.")
        let dbPing = '';
        if (settings != null && settings.disboardPing != null) dbPing = `<@&${settings.disboardPing}>`
        message.responder.success();
        dischannel.send(dbPing, { embed: embed } )
    }
}