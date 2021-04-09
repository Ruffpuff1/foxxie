const fs = require('fs')
const ms = require('ms')
module.exports = {
    name: 'remindme',
    aliases: ['rm'],
    description: 'Send a reminder message straight to your dms.',
    usage: `remindme [1s/1m/1h/1d/1w] [reason]`,
    guildOnly: false,
    execute(lang, message, args, client) {
        client.reminders = require('../../store/reminders.json')
        let remindTime = args[0]
        let remindMsg = args.slice(1).join(' ');
        if (!remindTime) {
            return message.channel.send(lang.COMMAND_REMINDME_NOTIME)
        }
        let timeFromNow = ms(ms(remindTime), { long: true })
        if (!remindMsg) {
            return message.channel.send(lang.COMMAND_REMINDME_NOREASON)
        }
        client.reminders [message.id] = {
            guild: message.guild.id,
            authID: message.author.id,
            time: Date.now() + ms(remindTime),
            message: remindMsg,
            timeago: timeFromNow,
            displayColor: message.guild.me.displayColor
        }
        fs.writeFile('./src/store/reminders.json', JSON.stringify(client.reminders, null, 4), err => {
            if (err) throw err
            message.channel.send(`${lang.COMMAND_REMINDME_CONFIRMED} **${timeFromNow}.**`)
        })
    }
}