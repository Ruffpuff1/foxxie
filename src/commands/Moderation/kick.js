module.exports = {
    name: 'kick',
    aliases: ['k', 'boot', '409'],
    usage: 'fox kick [user|userId] (reason)',
    category: 'moderation',
    permissions: 'KICK_MEMBERS',
    async execute ({ message, args, language }) {

        let res = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON');
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.responder.error('COMMAND_KICK_NOMEMBER');

        await this.executeKicks(res, member);
        message.responder.success();
        message.guild.log.send({type: 'mod', action: 'kick', moderator: message.member, member, reason: res, counter: 'kick', dm: true, channel: message.channel })
    },

    executeKicks(res, member) {
        member.kick(res).catch(() => null);
    }
}