module.exports = {
    name: 'vcmute',
    aliases: ['vcm'],
    usage: 'fox vcmute [member] (reason)',
    category: 'moderation',
    permissions: 'MUTE_MEMBERS',
    async execute({ message, args, language }) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args[1] || language.get('LOG_MODERATION_NOREASON');

        if (!member) return message.responder.error('COMMAND_VCMUTE_NOMEMBER');
        if (!member.voice.channelID) return message.responder.error('COMMAND_VCMUTE_NOVOICE');
        if (member.voice.serverMute) return message.responder.error('COMMAND_VCMUTE_ALREADY_MUTED');
        await member.voice.setMute(true, reason).catch(() => null);
        message.guild.log.send({ type: 'mod', action: 'vcmute', dm: true, channel: message.channel, moderator: message.member, member, reason });
        message.responder.success();
    }
}