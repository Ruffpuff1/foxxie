const mongo = require('../../../lib/structures/database/mongo')
const modchannelSchema = require('../../../lib/structures/database/schemas/modchannelSchema')
const Discord = require('discord.js')
const moment = require('moment')
module.exports = {
    name: 'lock',
    aliases: ['l', 'lockdown'],
    permissions: 'MANAGE_CHANNELS',
    usage: 'fox lock (reason)',
    execute: async(lang, message, args) => {

        if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send('COMMAND_LOCK_CHANNEL_ALREADY_LOCKED')

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
            message.channel.send(e)
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

        await mongo().then(async (mongoose) => {
            try {
                let results = await modchannelSchema.findById({
                    _id: message.guild.id
                })

                if (results === null) return

                const logChannel = message.guild.channels.cache.get(results.channelId);
                if (logChannel) logChannel.send(embed)
            } finally {}
        })

    }
}