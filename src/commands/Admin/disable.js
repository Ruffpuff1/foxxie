const { Command, Event } = require('foxxie');

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

        const instance = this.client.commands.get(piece) || this.client.events.get(piece);
        if (!instance) return msg.responder.error('COMMAND_DISABLE_NOPIECE');
        await this.getType(instance);
        if ((instance.type === 'command' && instance.name === 'disable') || (instance.type === 'monitor' && instance.name === 'commandHandler') || (instance.type === 'command' && instance.name === 'enable') || (instance.type === 'event' && instance.name === 'message'))
        return msg.responder.error('COMMAND_DISABLE_WARN', instance.name);
        
        await this.client.settings.push('blockedPieces', instance.name);
        return msg.responder.success();
    }

    getType(instance) {
        if (instance instanceof Command) Object.defineProperty(instance, 'type', { value: 'command' });
        if (instance instanceof Event) Object.defineProperty(instance, 'type', { value: 'event' });
        return instance;
    }
}