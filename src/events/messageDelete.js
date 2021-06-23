const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'messageDelete'
        })
    }

    run(message) {

        if (message.partial || !message.guild || !message?.guild?.log || !message?.guild?.available || message.author.bot) return false;
        message.guild.log.send({ type: 'delete', user: message.author, message: message, channel: message.channel })
    }
}