const fs = require('fs')
const { getGuildLang } = require('../../lib/util/getGuildLang')
const Discord = require('discord.js')
module.exports = client => {
    client.reminders = require('../store/reminders.json')
    client.setInterval(() => {
        for(let i in client.reminders) {
            let time = client.reminders[i].time
            let guildID = client.reminders[i].guildID
            let authID = client.reminders[i].authID
            let remindMessage = client.reminders[i].rmdMessage
            let member = client.users.cache.get(authID)
            let timeSince = client.reminders[i].timeago
            let message = client.reminders[i].message
            let sendIn = client.reminders[i].sendIn

            let lang = getGuildLang()

            if(Date.now() > time) {
                
                if(time === null) return
                const remindEmbed = new Discord.MessageEmbed()
                    .setAuthor(`Reminder For ${member.username}`, client.user.displayAvatarURL())
                    .setColor(client.reminders[i].color)
                    .setDescription(`${lang.COMMAND_REMINDER_HERE} **${timeSince}** ${lang.COMMAND_REMINDME_AGOFOR} **${remindMessage}**`)
                    .setTimestamp()
                
                sendIn ? message?.channel?.send(`<@${authID}> ${lang.COMMAND_REMINDER_HERE} **${timeSince}** ${lang.COMMAND_REMINDME_AGOFOR} **${remindMessage}**`) : client.users.cache.get(authID).send(remindEmbed)
                delete client.reminders[i]
                fs.writeFile('./src/store/reminders.json', JSON.stringify(client.reminders, null, 4), err => {
                    if (err) throw err
                })
            }
        }
    }, 1000);
}