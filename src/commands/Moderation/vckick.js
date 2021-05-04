const { moderationLog } = require("../../../lib/GuildLogger");

module.exports = {
    name: 'vckick',
    aliases: ['vck', 'disconnect'],
    usage: 'fox vckick [member] (reason)',
    category: 'moderation',
    permissions: 'MOVE_MEMBERS',
    execute: async(lang, msg, args) => {

        const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);

        if (!user) return msg.channel.send('COMMAND_VOICEKICK_NOMEMBER')
        if (!user.voice.channelID) return msg.channel.send('COMMAND_VOICEKICK_NOVOICE');
		user.voice.setChannel(null);
		msg.channel.send('COMMAND_VOICEKICK_SUCCESS');

        moderationLog(msg, user.user, args[1] || 'COMMAND_MODERATION_NOREASON', lang.LOG_MODERATION_VCKICK)
    }
}