const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'disable',
            description: language => language.get('COMMAND_DISABLE_DESCRIPTION'),
            usage: '[Piece]',
            permissionLevel: 10,
            category: 'admin'
        })
    }

    async run(msg, [piece]) {

        const instance = this.client.events.get(piece) || this.client.commands.get(piece) || this.client.monitors.get(piece) || this.client.languages.get(piece) || this.client.inhibitors.get(piece) || this.client.tasks.get(piece);
        if (!instance) return msg.responder.error('COMMAND_DISABLE_NOPIECE');
        if ((instance.type === 'command' && instance.name === 'disable') || (instance.type === 'monitor' && instance.name === 'commandHandler') || (instance.type === 'command' && instance.name === 'enable') || (instance.type === 'event' && instance.name === 'message'))
        return msg.responder.error('COMMAND_DISABLE_WARN', instance.name);
        
        await instance.disable();
        await this.client.settings.push('blockedPieces', instance.name);
        return msg.responder.success();
    }
}