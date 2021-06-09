const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'enable',
            description: language => language.get('COMMAND_ENABLE_DESCRIPTION'),
            usage: '[Piece]',
            permissions: 'CLIENT_OWNER',
            category: 'admin'
        })
    }

    async run(msg, [piece]) {

        const instance = this.client.commands.get(piece);
        if (!instance) return msg.responder.error('COMMAND_ENABLE_NOPIECE');
        await this.client.settings.pull('blockedPieces', instance.name);
        return msg.responder.success();
    }
}