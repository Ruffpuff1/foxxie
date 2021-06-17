const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'embed',
            aliases: ['broadcast', 'bc', 'announce'],
            description: language => language.get('COMMAND_EMBED_DESCRIPTION'),
            usage: '(Channel) [JSON]',
            permissions: 'ADMINISTRATOR',
            category: 'utility'
        })
    }

    async run(msg, args) {
        if (!args[0]) return msg.responder.error('COMMAND_EMBED_NOARGS');

        const channel = msg.channels.shift();
        if (channel) args.shift();

        try {
            const json = JSON.parse(args.join(' '));
            channel ? channel.send(json).catch(() => msg.responder.error('COMMAND_EMBED_ERROR')) : msg.channel.send(json).catch(() => msg.responder.error('COMMAND_EMBED_ERROR'));
            msg.delete();
        } catch (e) {
            return msg.responder.error('COMMAND_EMBED_ERROR')
        }
    }
}