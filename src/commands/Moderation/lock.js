module.exports = {
    name: 'lock',
    aliases: ['l', 'lockdown'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox lock (reason)',
    execute: async(props) => {

        let { message, args, lang, language } = props

        if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return language.send('COMMAND_LOCK_ALREADY', lang)
        if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) return message.responder.error('RESPONDER_ERROR_PERMS_CLIENT', lang, "MANAGE_CHANNELS")

        let reason = args.slice(0).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);

        let msg = await language.send('COMMAND_LOCK_LOCKING', lang);
        try {
            message.channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),
            { SEND_MESSAGES : false })

            message.responder.lock();
            msg.edit(language.get('COMMAND_LOCK_SUCCESS', lang));

        } catch(e) {
            console.log(e.message)
        };

        message.guild.log.moderation(message, message.channel, reason, 'Locked', 'lock', lang)
    }
}