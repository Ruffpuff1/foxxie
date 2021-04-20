const mongo = require('../../lib/structures/database/mongo')
const disboardBumpSchema = require('../../lib/structures/database/schemas/server/disboard/disboardBumpSchema')
const { getDisboardChannel } = require('../../lib/settings')
const fs = require('fs')
const ms = require('ms')
module.exports.disboardBump = async (message) => {
    if (message.content.toLowerCase() === '!d bump') {
        await mongo().then(async () => {
            try {
                let guildID = message.guild.id
                let bump = await disboardBumpSchema.findById({
                    _id: guildID
                })
                if (bump !== null) return

                let disChn = await getDisboardChannel(message)
                if (disChn === null) return
                if (message.channel.id !== disChn.disboardChannel)

                message.client.disboard = require('../store/disboard.json')
                let remindTime = '2h'
                let deleteTime = '1h'

                await disboardBumpSchema.findOneAndUpdate({
                    _id: guildID
                }, {
                    _id: guildID,
                    disboardBump: true
                }, {
                    upsert: true
                })

                message.client.disboard[guildID] = {
                    guild: guildID,
                    authID: message.author.id,
                    time: Date.now() + ms(remindTime),
                    channelID: disChn.disboardChannel,
                    displayColor: message.guild.me.displayColor,
                    deleteDbTime: Date.now() + ms(deleteTime)
                }

                fs.writeFile('src/store/disboard.json', JSON.stringify(message.client.disboard, null, 4), err => {
                    if (err) console.log(err)
                })
                message.react('✅')
            } finally {}
        })
    }
}