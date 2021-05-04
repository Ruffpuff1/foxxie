const Discord = require('discord.js')
const moment = require('moment')
const { serverSettings, server } = require('../../../lib/settings')
const { modStatsAdd } =  require('../../../src/tasks/stats')
module.exports = {
    name: 'unlock',
    aliases: ['ul', 'release'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox unlock (reason)',
    execute: async(lang, message, args) => {

        if (message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send('COMMAND_UNLOCK_CHANNEL_NOT_LOCKED')

        let reason = args.slice(0).join(' ') || 'No reason specified'
        let lockTime = moment(message.createdTimestamp).format('llll')

        let msg = await message.channel.send('COMMAND_UNLOCK_UNLOCKING')
        try {
            message.channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),
            {
                SEND_MESSAGES : null
            })
            message.react('🔓')

            msg.edit('COMMAND_UNLOCK_UNLOCKED_SUCCESS')
        } catch(e) {
            message.channel.send(e)
        }

        const embed = new Discord.MessageEmbed()
        .setTitle(`Unlocked channel`)
        .setColor(message.guild.me.displayColor)
        .setTimestamp()
        .addFields(
            { name: '**Channel locked**', value: `<#${message.channel.id}>`, inline: true },
            { name: '**Moderator**', value: `<@${message.member.user.id}> (ID: ${message.member.user.id})`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `**Reason**`, value: `${reason}`, inline: true },
            { name: `**Location**`, value: `<#${message.channel.id}>`, inline: true },
            { name: `**Date / Time**`, value: `${lockTime}`, inline: true }
        )

        modStatsAdd(message, 'unlock', 1)
        let results = await serverSettings(message)

        if (results == null || results.modChannel == null) return

        const logChannel = message.guild.channels.cache.get(results.modChannel);
        if (logChannel) logChannel.send(embed)
    }
}