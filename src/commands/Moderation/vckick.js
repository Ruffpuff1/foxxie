module.exports = {
    name: 'vckick',
    aliases: ['vck', 'disconnect'],
    usage: 'fox vckick [member] (reason)',
    category: 'moderation',
    permissions: 'MOVE_MEMBERS',
    execute: async(props) => {

        let { message, args, language } = props

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args[1] || language.get('LOG_MODERATION_NOREASON')

        if (!member) return message.responder.error('COMMAND_VCKICK_NOMEMBER')
        if (!member.voice.channelID) return message.responder.error('COMMAND_VCKICK_NOVOICE');
		await member.voice.setChannel(null).catch(() => null);
        message.guild.log.send({ member, reason, type: 'mod', action: 'vckick', channel: message.channel, moderator: message.member, dm: true })
		message.responder.success();
    }
}