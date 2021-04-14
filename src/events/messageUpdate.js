const { commandHandler } = require('./commandHandler')
module.exports = {
    name: 'messageUpdate',
    execute: async(oldMessage, newMessage) => {

        // Prevents the bot from reading DMs
        if (newMessage.channel.type === 'dm') return
        // Doesn't log link embed edits
        if (oldMessage.content.includes('https://')) return
        // Command edit with cmd handler
        const message = newMessage
        commandHandler(message)
    }
}