const fs = require('fs')
const Discord = require('discord.js');
const Language = require('../../lib/Language')

module.exports = client => {
    client.reminders = require('../store/reminders.json')
    client.setInterval(() => {
        for(let i in client.reminders) {
            
            let time = client.reminders[i].time
            let authID = client.reminders[i].authID
            let remindMessage = client.reminders[i].rmdMessage
            let member = client.users.cache.get(authID)
            let timeSince = client.reminders[i].timeago
            let sendIn = client.reminders[i].sendIn
            const guild = client.guilds.cache.get(client.reminders[i].guildId);
            const channel = guild.channels.cache.get(client.reminders[i].channelId)

            const language = new Language(guild)
            const lang = client.reminders[i].lang;

            if(Date.now() > time) {
                
                try {

                    const remindEmbed = new Discord.MessageEmbed()
                        .setAuthor(language.get('TASK_REMINDER_FOR', lang, member.username), client.user.displayAvatarURL())
                        .setColor(client.reminders[i].color)
                        .setDescription(language.get('TASK_REMINDER', lang, timeSince, remindMessage))
                        .setTimestamp()

                    if (sendIn && channel) channel.send(`<@${authID}> ${language.get('TASK_REMINDER', lang, timeSince, remindMessage)}`)
                    if (!sendIn) client.users.cache.get(authID).send(remindEmbed)

                    delete client.reminders[i]
                    fs.writeFile('./src/store/reminders.json', JSON.stringify(client.reminders, null, 4), err => { if (err) throw err })
                } catch {

                    delete client.reminders[i]
                    fs.writeFile('./src/store/reminders.json', JSON.stringify(client.reminders, null, 4), err => { if (err) throw err }) 
                }
            }
        }
    }, 1000);
}