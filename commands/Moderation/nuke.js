const Discord = require('discord.js')

module.exports = {
    name: 'nuke',
    description: "Nukes a channel, essentially cloning it so all the messages are gone.",
    permissions: ['ADMINISTRATOR'],

    execute(message) {
       
        message.channel.clone().then(channel => {
            channel.setPosition(message.channel.position)
            channel.send(`There you go mate, the channel was nuked successfully. I do hope you arent up to any bad things after you've done this. `)
        })
        message.channel.delete()
        
    },
};