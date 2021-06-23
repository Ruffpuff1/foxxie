const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'messageUpdate',
        });
    }

    run(old, message) {

        if (old.partial || message.partial || !message?.guild?.available || !message?.guild?.log || old.author.bot) return false;
        if ((old.content === message.content) && (old.attachments.size === message.attachments.size)) return false;
        this.client.monitors.run(message);
        return message.guild.log.send({ oldMessage: old, newMessage: message, user: old.author, channel: old.channel, type: 'edit' });
    }
}