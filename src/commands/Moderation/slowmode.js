module.exports = {
    name: 'slowmode',
    aliases: ['slowchat', 'slow', 'freeze', 's', 'sm'],
    usage: 'fox slowmode [seconds] (reason)',
    category: 'moderation',
    permissions: 'MANAGE_CHANNELS',
    execute: async(props) => {

        let { message, args, lang, language } = props
        
        if (!args[0]) return message.channel.send('COMMAND_SLOWMODE_NO_ARGS')
        let reason = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON', lang)

        if (args[0].toLowerCase() === 'none') args[0] = 0

        let time = Math.floor(args[0])
        if (isNaN(time)) {
            return message.channel.send('COMMAND_SLOWMODE_NOT_A_NUMBER')
        }

        if (time > 21600 || time < 0) {
            return message.channel.send('COMMAND_SLOWMODE_INVALID_TIME')
        }

        message.channel.setRateLimitPerUser(time)
        message.responder.success();

        message.guild.log.moderation(message, message.channel, reason, 'Slowmoded', 'slowmode', lang)
    }
}