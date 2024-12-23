const { botPermError } = require('../../../lib/util/error');
const { serverSettings } = require('../../../lib/settings')
const { addBan } = require('../../tasks/modCountAdd');
const moment = require('moment')
const Discord = require('discord.js')
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'ban',
    aliases: ['b', 'bean', '410', 'yeet', 'banish', 'begone', 'perish'],
    usage: 'fox ban [user|userId] (reason) (-p|-purge)',
    category: 'moderation',
    permissions: 'BAN_MEMBERS',
    execute: async (lang, message, args) => {
        if (!message.channel.permissionsFor(message.guild.me).has('BAN_MEMBERS')) return botPermError(lang, message, 'BAN_MEMBERS')

        let member = message.mentions.users.first() || message.client.users.cache.get(args[0]);

        if (!member) return message.channel.send("You need to provide **one member or user** to ban.")

        const mem = message.guild ? await message.guild.members.fetch(member).catch(() => null) : null;

        if (mem) {
            if (mem.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Higher roles")
            if (mem.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send("Higher roles")
        }

        if (member.id === message.member.user.id) return message.channel.send("self")
        if (member.id === message.guild.ownerID) return message.channel.send("owner")


        let reg = /\-purge\s*|-p\s*/gi
        let tru = reg.test(message.content)
        let res = args.slice(1).join(' ') || 'No reason specified';
        updatedRes = res.replace(reg, '')

        const date = moment(message.createdTimestamp).format('llll');

        let results = await serverSettings(message)
        //addBan(message)

        message.react(approved)
        addBan(message)

        const dmEmbed = new Discord.MessageEmbed()
                .setTitle(`Banned from ${message.guild.name}`)
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({dynamic:true}))
                .setDescription(`You have been banned from ${message.guild.name} with the following reason:\n\`\`\`${updatedRes}\`\`\``)

        member.send(dmEmbed)
        .catch(e => console.error(e))

        if (!mem) {
        message.guild.members.ban(member.id, {reason:updatedRes})
        .catch(console.error)
    }

    if (mem) {

        if (tru) {
            mem.ban({reason:updatedRes, days: 1})
            .catch(console.error)
        }
        if (!tru) {
            mem.ban({reason:updatedRes})
            .catch(console.error)
        }
    }
        if (results == null || results.modChannel == null) return

        const embed = new Discord.MessageEmbed()
            .setTitle(`Banned ${member.tag}`)
            .setColor(message.guild.me.displayColor)
            .setTimestamp()
            .addField('**Banned User**', `<@${member.id}> (ID: ${member.id})`, true)
            .addField('**Moderator**', `<@${message.member.user.id}> (ID: ${message.member.user.id})`, true)
            .addField('\u200B', '\u200B', true)
            .addField('**Reason**', updatedRes, true)
            .addField('**Location**', message.channel, true)
            .addField('**Date / Time**', date, true)

        const channel = message.guild.channels.cache.get(results.modChannel);
        if (channel) channel.send(embed)
    }
}