module.exports = {
    name: 'lock',
    aliases: ['l', 'lockdown'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox lock (reason)',
    async execute ({ message, args, lang, language }) {

        if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return language.send('COMMAND_LOCK_ALREADY', lang)
        let reason = args.slice(0).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);
        let msg = await language.send('COMMAND_LOCK_LOCKING', lang);

        message.channel.updateOverwrite(
            message.guild.id,
            { 
                SEND_MESSAGES : false 
            },
            reason
        )
        message.responder.lock();
        msg.edit(language.get('COMMAND_LOCK_SUCCESS', lang));
        message.guild.log.send({ type: 'mod', action: 'lock', moderator: message.member, reason, channel: message.channel, counter: 'lock', msg: message });
    }
}