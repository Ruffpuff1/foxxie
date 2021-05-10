const { emojis: { approved } } = require('../../../lib/util/constants')
const Discord = require('discord.js')
module.exports = {
    name: 'unban',
    aliases: ['ub', 'unbean'],
    usage: 'fox unban [user|userId] (reason)',
    category: 'moderation',
    permissions: 'BAN_MEMBERS',
    execute: async (props) => {

        let { message, args, lang, language } = props

        if (!message.channel.permissionsFor(message.guild.me).has('BAN_MEMBERS')) return message.responder.error('RESPONDER_ERROR_PERMS_CLIENT', lang, "BAN_MEMBERS")

        let res = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON', lang)
        let member = message.mentions.users.first() || message.client.users.cache.get(args[0]);

        if (!member) return message.channel.send("You need to provide **one user** to unban.")

        if (member.id === message.member.user.id) return message.channel.send("self")
        if (member.id === message.guild.ownerID) return message.channel.send("owner")

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

        message.guild.logger.moderation(message, member, res, 'Unbanned', 'unban', lang)
    }
}