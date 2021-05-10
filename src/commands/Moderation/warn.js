const { moderationCommandWarn } = require('../../../lib/structures/ModerationCommand')
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'warn',
    aliases: ['w'],
    usage: 'fox warn [user|userId] (reason)',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    execute: async(props) => {

        let { message, args, lang } = props

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.channel.send("You need to provide **one member** to give a warn to.")

        if (target.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("Higher roles")
        if (target.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send("Higher roles")
        if (target.user.id === message.member.user.id) return message.channel.send("self")
        if (target.user.id === message.guild.ownerID) return message.channel.send("owner")

        let reason = args.slice(1).join(' ')
        if (!reason) reason = 'No reason specified'

        moderationCommandWarn(message, reason, target, message.member, lang)
        message.react(approved)
    }
}