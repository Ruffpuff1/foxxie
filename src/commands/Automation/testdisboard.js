const { serverSettings } = require('../../../lib/settings')
const Discord = require('discord.js')
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'testdisboard',
    aliases: ['td', 'testbump'],
    usage: 'fox testdisboard',
    permissions: 'MANAGE_MESSAGES',
    category: 'automation',
    execute: async(lang, message, args) => {
        let results = await serverSettings(message)
        const dischannel = message.guild.channels.cache.get(results.disboardChannel)
        if (!dischannel) return

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle('Reminder to Bump')
            .setThumbnail(message.client.user.displayAvatarURL())

        embed.setDescription(results.disboardMessage?results.disboardMessage.replace(/{(server|guild)}/gi, message.guild.name):"Time to bump the server on disboard. Use the command `!d bump` then come back in **two hours**.")
        let dbPing = '';
        if (results != null && results.disboardPing != null) dbPing = `<@&${results.disboardPing}>`
        message.react(approved)
        dischannel.send(dbPing, { embed: embed } )
    }
}