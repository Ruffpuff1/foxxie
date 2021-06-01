module.exports = {
    name: 'ban',
    aliases: ['b', 'bean', '410', 'yeet', 'banish', 'begone', 'perish'],
    usage: 'fox ban [user|userId] (reason) (-p|-purge)',
    category: 'moderation',
    permissions: 'BAN_MEMBERS',
    async execute (props) {

        const { message, args, language } = props;

        const user = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!user) return message.responder.error('COMMAND_BAN_NOUSER')

        const purgeRegex = /\-purge\s*|-p\s*/gi;
        const purge = purgeRegex.test(message.content);
        const duration = null;
        let reason = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON');

        await this.executeBans({message, user, reason, purge, moderator: message.member, duration, regex: purgeRegex })
        await message.guild.log.send({ type: 'mod', action: 'ban', user, moderator: message.member, reason: reason.replace(purgeRegex, ''), channel: message.channel, dm: true, msg: message, counter: 'ban' })
        message.responder.success();
    },

    executeBans({ message, user, reason, purge, moderator, duration, regex }) {
        if (purge) return message.guild.members.ban(user.id, { reason: `${duration ? `[temp]` : ''} ${moderator.user.tag} | ${reason.replace(regex, '')}`, days: 1 }).catch(() => null);
        message.guild.members.ban(user.id, { reason: `${duration ? `[temp]` : ''} ${moderator.user.tag} | ${reason.replace(regex, '')}` }).catch(() => null);
    }
}