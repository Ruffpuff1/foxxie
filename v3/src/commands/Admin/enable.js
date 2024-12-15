const { Command } = require('@foxxie/tails');

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

        const instance = this.client.events.get(piece) || this.client.commands.get(piece) || this.client.monitors.get(piece) || this.client.languages.get(piece) || this.client.inhibitors.get(piece) || this.client.tasks.get(piece);
        if (!instance) return msg.responder.error('COMMAND_ENABLE_NOPIECE');
        instance.enable();
        await this.client.settings.pull('blockedPieces', instance.name);
        return msg.responder.success();
    }
}