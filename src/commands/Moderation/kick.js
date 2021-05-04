const { serverSettings } = require('../../../lib/settings')
const { botPermError } = require('../../../lib/util/error');
const { modStatsAdd } =  require('../../../src/tasks/stats')
const { emojis: { approved } } = require('../../../lib/util/constants')
const moment = require('moment')
const Discord = require('discord.js')
module.exports = {
    name: 'kick',
    aliases: ['k', 'boot', '409'],
    usage: 'fox kick [user|userId] (reason)',
    category: 'moderation',
    permissions: 'KICK_MEMBERS',
    execute: async (lang, message, args) => {
        if (!message.channel.permissionsFor(message.guild.me).has('KICK_MEMBERS')) return botPermError(lang, message, 'KICK_MEMBERS')

        let res = args.slice(1).join(' ') || 'No reason specified'
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) return message.channel.send("You need to provide **one member** to kick.")

        if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Higher roles")
        if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send("Higher roles")
        if (member.user.id === message.member.user.id) return message.channel.send("self")
        if (member.user.id === message.guild.ownerID) return message.channel.send("owner")


        const date = moment(message.createdTimestamp).format('llll');

        let results = await serverSettings(message)

        message.react(approved)
        modStatsAdd(message, 'kick', 1)

        const dmEmbed = new Discord.MessageEmbed()
                .setTitle(`Kicked from ${message.guild.name}`)
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({dynamic:true}))
                .setDescription(`You have been kicked from ${message.guild.name} with the following reason:\n\`\`\`${res}\`\`\``)

        member.send(dmEmbed)
        .catch(e => console.error(e))

        member.kick()
        .catch(console.error)

        if (results == null || results.modChannel == null) return

        const embed = new Discord.MessageEmbed()
            .setTitle(`Kicked ${member.user.tag}`)
            .setColor(message.guild.me.displayColor)
            .setTimestamp()
            .addField('**Kicked User**', `<@${member.user.id}> (ID: ${member.user.id})`, true)
            .addField('**Moderator**', `<@${message.member.user.id}> (ID: ${message.member.user.id})`, true)
            .addField('\u200B', '\u200B', true)
            .addField('**Reason**', res, true)
            .addField('**Location**', message.channel, true)
            .addField('**Date / Time**', date, true)

        const channel = message.guild.channels.cache.get(results.modChannel);
        if (channel) channel.send(embed)
    }
}