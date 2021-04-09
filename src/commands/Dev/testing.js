const { emojis, poll } = require('../../../lib/util/constants')
const Discord = require('discord.js')
module.exports = {
    name: 'testing',
    execute(lang, message, args) {       
        message.channel.send(`${lang.TESTING} **${message.member.user.username}** ${emojis.infinity}`)

    },
    
}