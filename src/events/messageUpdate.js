const commandHandler = require('../ws/commandHandler');

module.exports = {
    name: 'messageUpdate',
    execute: async(oldMessage, newMessage) => {

        if (oldMessage.partial || newMessage.partial || !newMessage?.guild?.available || !newMessage?.guild?.log || oldMessage.author.bot) return false;
		if ((oldMessage.content === newMessage.content) && (oldMessage.attachments.size === newMessage.attachments.size)) return false;
        await commandHandler.execute(newMessage);
        return newMessage.guild.log.send({ oldMessage, newMessage, user: oldMessage.author, channel: oldMessage.channel, type: 'edit' });
    }
}