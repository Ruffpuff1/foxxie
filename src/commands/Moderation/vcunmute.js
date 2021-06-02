module.exports = {
    name: 'vcunmute',
    aliases: ['vcum', 'letsay', 'letspeak'],
    usage: 'fox vcunmute [member] (reason)',
    category: 'moderation',
    permissions: 'MUTE_MEMBERS',
    async execute({ message, args, language }) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args[1] || language.get('LOG_MODERATION_NOREASON');

        if (!member) return message.responder.error('COMMAND_VCUNMUTE_NOMEMBER');
        if (!member.voice.channelID) return message.responder.error('COMMAND_VCUNMUTE_NOVOICE');
        if (!member.voice.serverMute) return message.responder.error('COMMAND_VCUNMUTE_NOTMUTED');
        await member.voice.setMute(false, reason).catch(() => null);
        message.guild.log.send({ type: 'mod', action: 'vcunmute', dm: true, channel: message.channel, moderator: message.member, member, reason });
        message.responder.success();
    }
}