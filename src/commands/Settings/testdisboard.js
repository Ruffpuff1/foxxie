const { getDisboardChannel, getDisboardMessage } = require('../../../lib/settings')
const Discord = require('discord.js')
module.exports = {
    name: 'testdisboard',
    aliases: ['td', 'testbump'],
    usage: 'fox testdisboard',
    permissions: 'MANAGE_MESSAGES',
    category: 'settings',
    execute: async(lang, message, args) => {
        let results = await getDisboardChannel(message)
        const dischannel = message.guild.channels.cache.get(results?.disboardChannel)
        if (!dischannel) return

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle('Reminder to Bump')
            .setThumbnail(message.client.user.displayAvatarURL())

        let dismessage = await getDisboardMessage(message)
        embed.setDescription(dismessage?dismessage.disboardMessage:"Time to bump the server on disboard. Use the command `!d bump` then come back in **two hours**.")
        let dbPing = '';
        if (dismessage) dbPing = `<@&${dismessage?.disboardPing}>`

        dischannel.send(dbPing, {embed:embed})
    }
}