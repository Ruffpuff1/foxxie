const fs = require('fs')
const db = require('quick.db')
const Discord = require('discord.js')
module.exports = client => {
    client.disboard = require('../store/disboard.json')
    client.setInterval(() => {
        for(let i in client.disboard) {
            let guildID = client.disboard[i].guild
            let authID = client.disboard[i].authID
            let disbordTime = client.disboard[i].time
            let guild = client.guilds.cache.get(guildID)
            let member = guild.members.cache.get(authID)
            let channelID = client.disboard[i].channelID
            let channel = guild.channels.cache.get(channelID)
            let color = client.disboard[i].displayColor
            let deleteTime = client.disboard[i].deleteDbTime

            if(Date.now() > deleteTime) {
                db.delete(`Guilds.${guildID}.Reminders.Disboardreminder`)
            }
    
    if (Date.now() > disbordTime) {
        if (disbordTime === null) return
        if (channel === undefined) return
    
        const remindEmbedDisboard = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle('Reminder to Bump')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription("Time to bump the server on disboard. Use the command `!d bump` then come back in **two hours**.")
        .setTimestamp()
        .setFooter(guild.name, guild.iconURL( { dynamic: true } ))
// checks for embed description 
        let embedDescription = db.get(`Guilds.${guildID}.Settings.Disboardmessage`)
        if (embedDescription) remindEmbedDisboard.setDescription(embedDescription)
    
    
    // checks if guild is the corner store
    if (guildID === '761512748898844702') {
        channel.send('**Heya <@&774339676487548969> it\'s time to bump the server.**', {embed: remindEmbedDisboard})
        delete client.disboard[i]
        fs.writeFile('src/store/disboard.json', JSON.stringify(client.disboard, null, 4), err => {
            if (err) throw err; 
        })
        //db.delete(`Guilds.${guildID}.Disboardremind`)
        return
    }
    // for if guild not corner store
    channel.send({embed: remindEmbedDisboard})
    delete client.disboard[i]
    
    fs.writeFile('src/store/disboard.json', JSON.stringify(client.disboard, null, 4), err => {
        if (err) throw err; 
    })
    
    //db.delete(`Guilds.${guildID}.Reminders.Disboardreminder`)
    
    }
    
    
        }
    })
}