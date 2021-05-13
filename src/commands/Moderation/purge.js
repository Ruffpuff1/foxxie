const moment = require('moment')
module.exports = {
    name: 'purge',
    aliases: ['prune', 'clear', 'clean', 'delete', 'p'],
    usage: 'fox purge (messages) (reason)',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    execute: async(props) => {

        let { message, args, lang, language } = props

        let num;
        let purgeTime = moment(message.createdTimestamp).format('llll');
        let reason = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON', lang)
        if (isNaN(args[0])) num = 50;
        if (!isNaN(args[0])) num = Number(args[0])

        let numLimit = Number(num)

        if (num == 0) return message.channel.send('COMMAND_PURGE_ZERO_MESSAGES')
        if (num > 99 || num < 0) return message.channel.send('COMMAND_PURGE_TOO_BIG_TOO_SMALL')

        message.channel.messages.fetch({
            limit: numLimit + 1
        })
        .then(msgs => {
            let notPin = msgs.filter(fetchedmsgs => !fetchedmsgs.pinned)
            message.channel.bulkDelete(notPin, true)
            .then(message.channel.send('COMMAND_PURGE_SUCCESS')
            .then(msg => {setTimeout(() => msg.delete(), 5000)}))
            .catch(err => {
                message.channel.send('COMMAND_PURGE_MSGS_TOO_OLD')
            })
        })

        message.guild.log.moderation(message, message.channel, reason, 'Purged', 'purge', lang, num)
    }
}