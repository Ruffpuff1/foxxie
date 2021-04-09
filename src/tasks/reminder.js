const fs = require('fs')
const db = require('quick.db')
const Discord = require('discord.js')
module.exports = client => {
    client.setInterval(() => {
        for(let i in client.reminders) {
            let time = client.reminders[i].time
            let guildID = client.reminders[i].guildID
            let authID = client.reminders[i].authID
            let remindMessage = client.reminders[i].message
            let member = client.users.cache.get(authID)
            let timeSince = client.reminders[i].timeago
            let color = client.reminders[i].displayColor

            var lang;
            var language = db.get(`Guilds.${guildID}.Settings.Language`)
            if (language ?
                language = language
                : language = 'en') 
                lang = require(`../../src/languages/${language}`)

            if(Date.now() > time) {
                let guild = client.guilds.cache.get(guildID)
                
                if(time === null) return
                const remindEmbed = new Discord.MessageEmbed()
                    .setAuthor(`Reminder For ${member.username}`, client.user.displayAvatarURL())
                    .setColor(color)
                    .setDescription(`${lang.COMMAND_REMINDER_HERE} **${timeSince}** ${lang.COMMAND_REMINDME_AGOFOR} **${remindMessage}**`)
                    .setTimestamp()
                
                client.users.cache.get(authID).send(remindEmbed)
                delete client.reminders[i]
                fs.writeFile('./src/store/reminders.json', JSON.stringify(client.reminders, null, 4), err => {
                    if (err) throw err
                })
            }
        }
    }, 1000);
}