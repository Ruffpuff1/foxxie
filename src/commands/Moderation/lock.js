module.exports = {
    name: 'lock',
    aliases: ['l', 'lockdown'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox lock (reason)',
    async execute ({ message, args, language }) {

        if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.responder.error('COMMAND_LOCK_ALREADY');
        let reason = args.slice(0).join(' ') || language.get('LOG_MODERATION_NOREASON');
        let msg = await message.responder.success('COMMAND_LOCK_LOCKING');

        message.channel.updateOverwrite(
            message.guild.id,
            { 
                SEND_MESSAGES : false 
            },
            reason
        )
        message.responder.lock();
        msg.edit(language.get('COMMAND_LOCK_SUCCESS'));
        message.guild.log.send({ type: 'mod', action: 'lock', moderator: message.member, reason, channel: message.channel, counter: 'lock', msg: message });
    }
}