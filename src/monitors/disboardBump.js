const fs = require('fs')
const ms = require('ms')
module.exports = {
    name: 'disboardbump',
    type: 'message',
    execute: async (message) => {

    if (!message.guild) return

    if (message.author.id === '302050872383242240'){

        let emb = message.embeds.length === 1
        ? (message.embeds[0].description.endsWith(`https://disboard.org/`) ? true : false)
        : false

        let discordChannel = await message.guild.settings.get('discordChannel')
        if (!discordChannel) return;

        if(emb){
            message.client.disboard = require('../store/disboard.json')

            let remindTime = '2h'
            
            message.client.disboard[message.guild.id] = {
                guild: message.guild.id,
                time: Date.now() + ms(remindTime),
                channelID: disboardChannel,
                message: message,
                color: message.guild.me.displayColor
            }

            fs.writeFile('src/store/disboard.json', JSON.stringify(message.client.disboard, null, 4), err => {
                if (err) console.log(err)
            })
        }
    }}
}