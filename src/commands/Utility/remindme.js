const fs = require('fs')
const ms = require('ms')
module.exports = {
    name: 'remindme',
    aliases: ['rm'],
    usage: `remindme [1s|1m|1h|1d|1w] [reason] (-c|-channel)`,
    category: 'utility',
    execute(lang, message, args, client) {
        client.reminders = require('../../store/reminders.json')
        let remindTime = args[0]
        let remindMsg = args.slice(1).join(' ');

        if (!remindTime) return message.channel.send(lang.COMMAND_REMINDME_NOTIME)
        let reg = /^\d*[s|m|h|d|w|y]$/gmi

        if (!reg.test(remindTime)) return message.channel.send(`That **doesn't** seem to be a proper time. Try again with the format [5s|5m|5h|5d|5w].`)
        
        let timeFromNow = ms(ms(remindTime), { long: true } )
        if (!remindMsg) {
            return message.channel.send(lang.COMMAND_REMINDME_NOREASON)
        }

        let sendIn = /\-channel\s*|-c\s*/gi
        remindMsg = remindMsg.replace(sendIn, '')

        client.reminders [message.id] = {
            guild: message.guild.id,
            authID: message.author.id,
            time: Date.now() + ms(remindTime),
            rmdMessage: remindMsg,
            timeago: timeFromNow,
            message: message,
            sendIn: sendIn.test(message.content),
            color: message.guild.me.displayColor
        }
        fs.writeFile('./src/store/reminders.json', JSON.stringify(client.reminders, null, 4), err => {
            if (err) throw err
            message.channel.send(`${lang.COMMAND_REMINDME_CONFIRMED} **${timeFromNow}.**`)
        })
    }
}