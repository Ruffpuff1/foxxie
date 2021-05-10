module.exports = {
    name: 'lock',
    aliases: ['l', 'lockdown'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox lock (reason)',
    execute: async(props) => {

        let { message, args, lang, language } = props

        if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send('COMMAND_LOCK_CHANNEL_ALREADY_LOCKED')
        if (!message.channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) return message.responder.error('RESPONDER_ERROR_PERMS_CLIENT', lang, "MANAGE_CHANNELS")

        let reason = args.slice(0).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);

        let msg = await message.channel.send('COMMAND_LOCK_LOCKING')
        try {
            message.channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),
            {
                SEND_MESSAGES : false
            })
            message.react('🔒')

            msg.edit('COMMAND_LOCK_LOCKED_SUCCESS')
        } catch(e) {
            console.log(e)
        }

        message.guild.logger.moderation(message, message.channel, reason, 'Locked', 'lock', lang)
    }
}