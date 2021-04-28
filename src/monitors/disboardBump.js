const { serverSettings } = require('../../lib/settings')
const fs = require('fs')
const ms = require('ms')
module.exports = {
    name: 'disboardbump',
    execute: async (message) => {

    if (!message.guild) return

    if (message.author.id === '302050872383242240'){

        let emb = message.embeds.length === 1
        ? (message.embeds[0].description.endsWith(`https://disboard.org/`) ? true : false)
        : false

        let server = await serverSettings(message)
        if (server == null) return;
        if (server.disboardChannel == null) return;

        if(emb){
            message.client.disboard = require('../store/disboard.json')

            let remindTime = '2h'
            
            message.client.disboard[message.guild.id] = {
                guild: message.guild.id,
                time: Date.now() + ms(remindTime),
                channelID: server.disboardChannel,
                message: message,
                color: message.guild.me.displayColor
            }

            fs.writeFile('src/store/disboard.json', JSON.stringify(message.client.disboard, null, 4), err => {
                if (err) console.log(err)
            })
        }
      }  }
}