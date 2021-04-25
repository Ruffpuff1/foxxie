const mongo = require('../../lib/structures/database/mongo')
const { serverSettings } = require('../../lib/settings')
const { serverSchema } = require('../../lib/structures/schemas')
const { emojis: { approved } } = require('../../lib/util/constants')
const fs = require('fs')
const ms = require('ms')
module.exports.disboardBump = async (message) => {
    if (message.content.toLowerCase() === '!d bump') {
        await mongo().then(async () => {
            try {
                let guildID = message.guild.id
                let bump = await serverSettings(message)
                if (bump.disboardBump != null) return

                if (bump == null || bump.disboardChannel == null) return
                if (message.channel.id != bump.disboardChannel) return

                message.client.disboard = require('../store/disboard.json')
                let remindTime = '2h'
                let deleteTime = '30m'

                await serverSchema.findByIdAndUpdate({
                    _id: guildID
                }, {
                    _id: guildID,
                    disboardBump: true
                }, {
                    upsert: true
                })

                message.client.disboard[guildID] = {
                    guild: guildID,
                    time: Date.now() + ms(remindTime),
                    channelID: bump.disboardChannel,
                    deleteDbTime: Date.now() + ms(deleteTime),
                    message: message,
                    color: message.guild.me.displayColor
                }

                fs.writeFile('src/store/disboard.json', JSON.stringify(message.client.disboard, null, 4), err => {
                    if (err) console.log(err)
                })
                message.react(approved)
            } finally {}
        })
    }
}