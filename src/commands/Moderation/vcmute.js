module.exports = {
    name: 'vcmute',
    aliases: ['vcm'],
    usage: 'fox vcmute [member] (reason)',
    category: 'moderation',
    permissions: 'MUTE_MEMBERS',
    async execute(props) {

        let { message, args, lang, language } = props;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args[1] || language.get('LOG_MODERATION_NOREASON');

        if (!member) return message.responder.error('COMMAND_VCMUTE_NOMEMBER');
        if (!member.voice.channelID) return message.responder.error('COMMAND_VCMUTE_NOVOICE');
        if (member.voice.serverMute) return message.responder.error('COMMAND_VCMUTE_ALREADY_MUTED');
        member.voice.setMute(true, reason);
        message.responder.success();

        message.guild.log.moderation(message, member.user, reason, 'Vcmuted', 'vcmute', lang)
    }
}