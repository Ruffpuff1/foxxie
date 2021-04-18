const { getGuildModChannel } = require('../../../lib/settings');
const { botPermError } = require('../../../lib/util/error');
const { addBan } = require('../../tasks/modCountAdd');
const moment = require('moment')
const Discord = require('discord.js')
module.exports = {
    name: 'ban',
    aliases: ['b', 'bean', '410', 'yeet', 'banish', 'begone', 'perish'],
    usage: 'fox ban [user] (reason)',
    category: 'moderation',
    permissions: 'KICK_MEMBERS',
    execute: async (lang, message, args) => {
        if (!message.channel.permissionsFor(message.guild.me).has('BAN_MEMBERS')) return botPermError(lang, message, 'BAN_MEMBERS')

        let res = args.slice(1).join(' ') || 'No reason specified'
        let member = message.mentions.users.first() || message.client.users.cache.get(args[0]);

        if (!member) return message.channel.send("You need to provide **one member or user** to ban.")

        const mem = message.guild ? await message.guild.members.fetch(member).catch(() => null) : null;

        if (mem) {
            if (mem.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Higher roles")
            if (mem.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send("Higher roles")
        }

        if (member.id === message.member.user.id) return message.channel.send("self")
        if (member.id === message.guild.ownerID) return message.channel.send("owner")


        const date = moment(message.createdTimestamp).format('llll');

        let results = await getGuildModChannel(message)
        addBan(message)

        message.react('✅')

        const dmEmbed = new Discord.MessageEmbed()
                .setTitle(`Banned from ${message.guild.name}`)
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({dynamic:true}))
                .setDescription(`You have been banned from ${message.guild.name} with the following reason:\n\`\`\`${res}\`\`\``)

        member.send(dmEmbed)
        .catch(e => console.error(e))

        if (!mem) {
        message.guild.members.ban(member.id, {reason:res})
        .catch(console.error)
    }

    if (mem) {
        mem.ban({reason:res})
        .catch(console.error)
    }
        if (results === null) return

        const embed = new Discord.MessageEmbed()
            .setTitle(`Banned ${member.tag}`)
            .setColor(message.guild.me.displayColor)
            .setTimestamp()
            .addField('**Banned User**', `<@${member.id}> (ID: ${member.id})`, true)
            .addField('**Moderator**', `<@${message.member.user.id}> (ID: ${message.member.user.id})`, true)
            .addField('\u200B', '\u200B', true)
            .addField('**Reason**', res, true)
            .addField('**Location**', message.channel, true)
            .addField('**Date / Time**', date, true)

        const channel = message.guild.channels.cache.get(results.channelId);
        if (channel) channel.send(embed)
    }
}