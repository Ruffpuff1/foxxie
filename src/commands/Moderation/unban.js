const { botPermError } = require('../../../lib/util/error');
const { serverSettings } = require('../../../lib/settings')
const { emojis: { approved } } = require('../../../lib/util/constants')
const moment = require('moment')
const Discord = require('discord.js')
module.exports = {
    name: 'unban',
    aliases: ['ub', 'unbean'],
    usage: 'fox unban [user|userId] (reason)',
    category: 'moderation',
    permissions: 'BAN_MEMBERS',
    execute: async (lang, message, args) => {
        if (!message.channel.permissionsFor(message.guild.me).has('BAN_MEMBERS')) return botPermError(lang, message, 'BAN_MEMBERS')

        let res = args.slice(1).join(' ') || 'No reason specified'
        let member = message.mentions.users.first() || message.client.users.cache.get(args[0]);

        if (!member) return message.channel.send("You need to provide **one user** to unban.")

        if (member.id === message.member.user.id) return message.channel.send("self")
        if (member.id === message.guild.ownerID) return message.channel.send("owner")


        const date = moment(message.createdTimestamp).format('llll');

        let results = await serverSettings(message)

        message.react(approved)

        const dmEmbed = new Discord.MessageEmbed()
                .setTitle(`Unbanned from ${message.guild.name}`)
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({dynamic:true}))
                .setDescription(`You have been unbanned from ${message.guild.name} with the following reason:\n\`\`\`${res}\`\`\``)

        member.send(dmEmbed)
        .catch(e => console.error(e))

        message.guild.members.unban(member, res)
        .catch(console.error)

        if (results == null || results?.modChannel == null) return

        const embed = new Discord.MessageEmbed()
            .setTitle(`Unbanned ${member.tag}`)
            .setColor(message.guild.me.displayColor)
            .setTimestamp()
            .addField('**Unbanned User**', `<@${member.id}> (ID: ${member.id})`, true)
            .addField('**Moderator**', `<@${message.member.user.id}> (ID: ${message.member.user.id})`, true)
            .addField('\u200B', '\u200B', true)
            .addField('**Reason**', res, true)
            .addField('**Location**', message.channel, true)
            .addField('**Date / Time**', date, true)

        const channel = message.guild.channels.cache.get(results.modChannel);
        if (channel) channel.send(embed)
    }
}