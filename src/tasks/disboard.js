const fs = require('fs')
const Discord = require('discord.js')
const { serverSchema } = require('../../lib/structures/schemas')
const mongo = require('../../lib/structures/database/mongo')
module.exports.disboard = (client) => {
    client.disboard = require('../store/disboard.json')
    client.setInterval(async () => {
        for(let i in client.disboard) {
            let guildID = client.disboard[i].guild
            let disboardTime = client.disboard[i].time
            let channelID = client.disboard[i].channelID
            let color = client.disboard[i].color

            let guild = client.guilds.cache.get(guildID)
            let channel = guild.channels.cache.get(channelID)

            if (disboardTime === null) return;

            if (Date.now() > disboardTime) {
                await mongo().then(async () => {
                    try {
                        let disb = await serverSchema.findById({
                            _id: guildID
                        })

                        // if (disb == undefined) return;

                        const embed = new Discord.MessageEmbed()
                            .setColor(color)
                            .setTitle('Reminder to Bump')
                            .setThumbnail(client.user.displayAvatarURL())
                            .setDescription("Time to bump the server on disboard. Use the command `!d bump` then come back in **two hours**.")

                        // Checks if Disboard Message is set
                        if (disb){
                        if (disb.disboardMessage) embed.setDescription(disb.disboardMessage)
                        }
                        // Checks if guild is The Corner Store
                        if (guildID === '761512748898844702') {
                            delete client.disboard[i]
                            fs.writeFile('src/store/disboard.json', JSON.stringify(client.disboard, null, 4), err => {
                                if (err) throw err
                            })
                            if (channel === undefined) return
                            return channel.send('**Heya <@&774339676487548969> it\'s time to bump the server.**', {embed: embed})
                        }
                        // If other guild

                        delete client.disboard[i]
                        fs.writeFile('src/store/disboard.json', JSON.stringify(client.disboard, null, 4), err => {
                            if (err) throw err
                        })

                        let roleID;
                        if (disb) {
                            if (disb.disboardPing != null) roleID = disb.disboardPing
                            let dbPing = ''
                            if (roleID !== '' && roleID !== undefined) dbPing = `<@&${roleID}>`
                            
                            if (channel === undefined) return
                            return channel.send(dbPing, {embed: embed} )
                        }

                        if (channel === undefined) return
                        channel.send(embed)
                       
                    } finally {}
                })
            }

        }
    }, 1000)
}