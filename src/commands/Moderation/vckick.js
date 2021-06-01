module.exports = {
    name: 'vckick',
    aliases: ['vck', 'disconnect'],
    usage: 'fox vckick [member] (reason)',
    category: 'moderation',
    permissions: 'MOVE_MEMBERS',
    execute: async(props) => {

        let { message, args, lang, language } = props

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args[1] || language.get('LOG_MODERATION_NOREASON')

        if (!user) return message.responder.error('COMMAND_VCKICK_NOMEMBER')
        if (!user.voice.channelID) return message.responder.error('COMMAND_VCKICK_NOVOICE');
		user.voice.setChannel(null);
		message.responder.success();

        message.guild.log.moderation(message, user.user, reason, 'Vckicked', 'vckick', lang)
    }
}