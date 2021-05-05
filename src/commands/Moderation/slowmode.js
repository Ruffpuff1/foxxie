const Discord = require('discord.js')
const moment = require('moment')
const { modStatsAdd } =  require('../../../src/tasks/stats')
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'slowmode',
    aliases: ['slowchat', 'slow', 'freeze', 's', 'sm'],
    usage: 'fox slowmode [seconds] (reason)',
    category: 'moderation',
    permissions: 'MANAGE_CHANNELS',
    execute: async(props) => {

        let { message, args, lang, settings } = props
        
        if (!args[0]) return message.channel.send('COMMAND_SLOWMODE_NO_ARGS')
        let slowTime = moment(message.createdTimestamp).format('llll');
        let reason = args.slice(1).join(' ') || 'No reason specified'

        if (args[0].toLowerCase() === 'none') args[0] = 0

        let time = Math.floor(args[0])
        if (isNaN(time)) {
            return message.channel.send('COMMAND_SLOWMODE_NOT_A_NUMBER')
        }

        if (time > 21600 || time < 0) {
            return message.channel.send('COMMAND_SLOWMODE_INVALID_TIME')
        }

        message.channel.setRateLimitPerUser(time)
        message.react(approved)

        const embed = new Discord.MessageEmbed()
            .setTitle(`Slowmode ${time} second${time > 1 ? 's' 
            : `${time === 0 ? 's' : ''}`}`)
            .setColor(message.guild.me.displayColor)
            .setTimestamp()
            .addField('**Slowmode Duration**', `${time} second${time > 1 ? 's' 
            : `${time === 0 ? 's' : ''}`}`, true)
            .addField('**Moderator**', `<@${message.member.user.id}> (ID: ${message.member.user.id})`, true)
            .addField(`\u200B`, '\u200B', true)
            .addField('**Reason**', reason, true)
            .addField('**Location**', message.channel, true)
            .addField('**Date / Time**', slowTime, true)

        modStatsAdd(message, 'slowmode', 1)

        if (settings == null || settings.modChannel == null) return

        const logChannel = message.guild.channels.cache.get(settings.modChannel);
        if (logChannel) logChannel.send(embed)  
    }
}