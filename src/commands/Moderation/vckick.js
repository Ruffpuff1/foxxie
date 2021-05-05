const { moderationLog } = require("../../../lib/GuildLogger");

module.exports = {
    name: 'vckick',
    aliases: ['vck', 'disconnect'],
    usage: 'fox vckick [member] (reason)',
    category: 'moderation',
    permissions: 'MOVE_MEMBERS',
    execute: async(props) => {

        let { message, args, lang } = props

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!user) return message.channel.send('COMMAND_VOICEKICK_NOMEMBER')
        if (!user.voice.channelID) return message.channel.send('COMMAND_VOICEKICK_NOVOICE');
		user.voice.setChannel(null);
		message.channel.send('COMMAND_VOICEKICK_SUCCESS');

        moderationLog(message, user.user, args[1] || 'COMMAND_MODERATION_NOREASON', lang.LOG_MODERATION_VCKICK)
    }
}