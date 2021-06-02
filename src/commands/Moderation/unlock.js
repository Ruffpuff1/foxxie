module.exports = {
    name: 'unlock',
    aliases: ['ul', 'release'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox unlock (reason)',
    async execute ({ message, args, language }) {

        if (message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.responder.error('COMMAND_UNLOCK_CHANNELNOTLOCKED');
        let reason = args.slice(0).join(' ') || language.get('LOG_MODERATION_NOREASON');
        let msg = await message.responder.success('COMMAND_UNLOCK_UNLOCKING');

        await message.channel.updateOverwrite(
            message.guild.id,
            { 
                SEND_MESSAGES : null 
            },
            reason
        )
        message.responder.unlock();
        message.guild.log.send({ channel: message.channel, moderator: message.member, reason, type: 'mod', action: 'unlock', counter: 'unlock' });
        msg.edit(language.get('COMMAND_UNLOCK_SUCCESS'));
    }
}