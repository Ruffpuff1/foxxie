const fs = require('fs')
const Discord = require('discord.js')
const { serverSettings } = require('../../lib/settings')
const { serverSchema } = require('../../lib/structures/schemas')
const mongo = require('../../lib/structures/database/mongo')
module.exports.disboard = (client) => {
    client.disboard = require('../store/disboard.json')
    client.setInterval(async () => {
        for(let i in client.disboard) {
            let guildID = client.disboard[i].guild
            let disboardTime = client.disboard[i].time
            let guild = client.guilds.cache.get(guildID)
            let channelID = client.disboard[i].channelID
            let channel = guild.channels.cache.get(channelID)
            let deleteTime = client.disboard[i].deleteDbTime
            let color = client.disboard[i].color
            msg = client.disboard[i].message

            if (Date.now() > deleteTime) {
                await mongo().then(async () => {
                    try {
                        await serverSchema.findByIdAndUpdate({
                            _id: guildID,
                        }, {
                            _id: guildID,
                            $unset: {
                                disboardBump: ''
                            }
                        })
                    } finally {}
                })
            }

            if (disboardTime === null) return
            if (Date.now() > disboardTime) {
                await mongo().then(async () => {
                    try {
                        let disb = await serverSettings(msg)

                        const embed = new Discord.MessageEmbed()
                            .setColor(msg.guild.me.displayColor)
                            .setTitle('Reminder to Bump')
                            .setThumbnail(client.user.displayAvatarURL())
                            .setDescription("Time to bump the server on disboard. Use the command `!d bump` then come back in **two hours**.")

                        // Checks if Disboard Message is set
                        if (disb.disboardMessage != null) embed.setDescription(disb.disboardMessage)
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
                        let roleID
                        if (disb.disboardPing != null) roleID = disb.disboardPing
                        let dbPing = ''
                        if (roleID !== '' && roleID !== undefined) dbPing = `<@&${roleID}>`

                        delete client.disboard[i]
                        fs.writeFile('src/store/disboard.json', JSON.stringify(client.disboard, null, 4), err => {
                            if (err) throw err
                        })
                        if (channel === undefined) return
                        channel.send(dbPing, {embed: embed} )
                    } finally {}
                })
            }

        }
    }, 1000)
}