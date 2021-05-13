module.exports = {
    name: 'unlock',
    aliases: ['ul', 'release'],
    permissions: 'MANAGE_CHANNELS',
    category: 'moderation',
    usage: 'fox unlock (reason)',
    execute: async(props) => {

        let { message, args, lang, language } = props

        if (message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.channel.send('COMMAND_UNLOCK_CHANNEL_NOT_LOCKED')

        let reason = args.slice(0).join(' ') || language.get('LOG_MODERATION_NOREASON', lang)
        
        let msg = await message.channel.send('COMMAND_UNLOCK_UNLOCKING')
        try {
            message.channel.updateOverwrite(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"),
            {
                SEND_MESSAGES : null
            })
            message.react('🔓')

            msg.edit('COMMAND_UNLOCK_UNLOCKED_SUCCESS')
        } catch(e) {
            message.channel.send(e)
        }

        message.guild.log.moderation(message, message.channel, reason, 'Unlocked', 'unlock', lang)
    }
}