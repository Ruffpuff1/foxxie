const { modStatsAdd } =  require('../../../src/tasks/stats')
const Discord = require('discord.js')
const moment = require('moment')
module.exports = {
    name: 'lock',
    aliases: ['l', 'lockdown'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox lock (reason)',
    execute: async(props) => {

        let { message, args, lang } = props

        if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send('COMMAND_LOCK_CHANNEL_ALREADY_LOCKED')
        if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) return message.responder.error.clientPerms(message, 'MANAGE_CHANNELS')

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
        
        modStatsAdd(message, 'lock', 1)

        if (settings == null || settings.modChannel == null) return

        const logChannel = message.guild.channels.cache.get(settings.modChannel);
        if (logChannel) logChannel.send(embed)
    }
}