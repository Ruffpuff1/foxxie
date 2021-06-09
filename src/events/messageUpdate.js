const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'messageUpdate',
        });
    }

    run(oldMessage, newMessage) {

        if (oldMessage.partial || newMessage.partial || !newMessage?.guild?.available || !newMessage?.guild?.log || oldMessage.author.bot) return false;
        if ((oldMessage.content === newMessage.content) && (oldMessage.attachments.size === newMessage.attachments.size)) return false;
        newMessage.client.monitors.get('commandHandler').execute(newMessage);
        return newMessage.guild.log.send({ oldMessage, newMessage, user: oldMessage.author, channel: oldMessage.channel, type: 'edit' });
    }
}