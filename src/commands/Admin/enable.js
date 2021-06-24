const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'enable',
            description: language => language.get('COMMAND_ENABLE_DESCRIPTION'),
            usage: '[Piece]',
            permissionLevel: 10,
            category: 'admin'
        })
    }

    async run(msg, [piece]) {

        const instance = this.client.commands.get(piece) || this.client.events.get(piece);;
        if (!instance) return msg.responder.error('COMMAND_ENABLE_NOPIECE');
        await this.client.settings.pull('blockedPieces', instance.name);
        return msg.responder.success();
    }
}