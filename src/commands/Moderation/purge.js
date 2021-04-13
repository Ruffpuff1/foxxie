const mongo = require('../../../lib/structures/database/mongo')
const modchannelSchema = require('../../../lib/structures/database/schemas/server/moderation/modchannelSchema')
const Discord = require('discord.js')
const moment = require('moment')
module.exports = {
    name: 'purge',
    aliases: ['prune', 'clear', 'clean', 'delete', 'p'],
    usage: 'fox purge (messages) (reason)',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    execute: async(lang, message, args) => {

        let num;
        let purgeTime = moment(message.createdTimestamp).format('llll');
        let reason = args.slice(1).join(' ') || 'No reason specified'
        if (isNaN(args[0])) num = 50;
        if (!isNaN(args[0])) num = Number(args[0])

        let numLimit = Number(num)

        if (num == 0) return message.channel.send('COMMAND_PURGE_ZERO_MESSAGES')
        if (num > 99 || num < 0) return message.channel.send('COMMAND_PURGE_TOO_BIG_TOO_SMALL')

            message.channel.messages.fetch({
                limit: numLimit + 1
            })
            .then(msgs => {
                let notPin = msgs.filter(fetchedmsgs => !fetchedmsgs.pinned)
                message.channel.bulkDelete(notPin, true)
                .then(message.channel.send('COMMAND_PURGE_SUCCESS')
                .then(msg => {setTimeout(() => msg.delete(), 5000)}))
                .catch(err => {
                    message.channel.send('COMMAND_PURGE_MSGS_TOO_OLD')
                })
            })

        const embed = new Discord.MessageEmbed()
            .setTitle(`Purged ${num} message${num > 1 ? 's' : ''}`)
            .setColor(message.guild.me.displayColor)
            .setTimestamp()
            .addField('**Moderator**', `<@${message.member.user.id}> (ID: ${message.member.user.id})`, true)
            .addField(`\u200B`, '\u200B', true)
            .addField(`\u200B`, '\u200B', true)
            .addField('**Reason**', reason, true)
            .addField('**Location**', message.channel, true)
            .addField('**Date / Time**', purgeTime, true)

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