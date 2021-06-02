module.exports = {
    name: 'unban',
    aliases: ['ub', 'unbean'],
    usage: 'fox unban [user|userId] (reason)',
    category: 'moderation',
    permissions: 'BAN_MEMBERS',
    async execute ({ message, args, language }) {

        let user = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        let reason = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON');
        if (!user) return message.responder.error('COMMAND_UNBAN_NOUSER');
        await this.executeUnbans(message, user, reason);
        message.guild.log.send({ type: 'mod', action: 'unban', moderator: message.member, user, reason, dm: true, counter: 'unban', channel: message.channel })
        message.responder.success();
    }, 

    executeUnbans(msg, user, reason) {
        msg.guild.members.unban(user, reason).catch(() => null);
    }
}