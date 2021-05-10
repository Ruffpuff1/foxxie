const { emojis: { approved } } = require('../../../lib/util/constants')
const Discord = require('discord.js')
module.exports = {
    name: 'kick',
    aliases: ['k', 'boot', '409'],
    usage: 'fox kick [user|userId] (reason)',
    category: 'moderation',
    permissions: 'KICK_MEMBERS',
    execute: async (props) => {

        let { message, args, lang, language } = props

        if (!message.channel.permissionsFor(message.guild.me).has('KICK_MEMBERS')) return message.responder.error('RESPONDER_ERROR_PERMS_CLIENT', lang, "KICK_MEMBERS")

        let res = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) return message.channel.send("You need to provide **one member** to kick.")

        if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Higher roles")
        if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send("Higher roles")
        if (member.user.id === message.member.user.id) return message.channel.send("self")
        if (member.user.id === message.guild.ownerID) return message.channel.send("owner")

        message.react(approved)

        const dmEmbed = new Discord.MessageEmbed()
                .setTitle(`Kicked from ${message.guild.name}`)
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL({dynamic:true}))
                .setDescription(`You have been kicked from ${message.guild.name} with the following reason:\n\`\`\`${res}\`\`\``)

        member.send(dmEmbed)
        .catch(e => console.error(e))

        member.kick()
        .catch(console.error)

        message.guild.logger.moderation(message, member, res, 'Kicked', 'kick', lang)
    }
}