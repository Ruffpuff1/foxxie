const { serverSettings } = require('../../../lib/settings')
const { addLock } = require('../../tasks/modCountAdd')
const Discord = require('discord.js')
const moment = require('moment')
const { botPermError } = require('../../../lib/util/error')
module.exports = {
    name: 'lock',
    aliases: ['l', 'lockdown'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox lock (reason)',
    execute: async(lang, message, args) => {

        if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send('COMMAND_LOCK_CHANNEL_ALREADY_LOCKED')
        if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) return botPermError(lang, message, 'MANAGE_CHANNELS')

        let reason = args.slice(0).join(' ') || 'No reason specified'
        let lockTime = moment(message.createdTimestamp).format('llll')

        let msg = await message.channel.send('COMMAND_LOCK_LOCKING')
        try {
            message.channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),
            {
                SEND_MESSAGES : false
            })
            message.react('🔒')

            msg.edit('COMMAND_LOCK_LOCKED_SUCCESS')
        } catch(e) {
            console.log(e)
        }

        const embed = new Discord.MessageEmbed()
        .setTitle(`Locked channel`)
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
        
        addLock(message)
        let results = await serverSettings(message)

        if (results == null || results?.modChannel == null) return

        const logChannel = message.guild.channels.cache.get(results?.modChannel);
        if (logChannel) logChannel.send(embed)
    }
}