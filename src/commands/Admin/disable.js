const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'disable',
            description: language => language.get('COMMAND_DISABLE_DESCRIPTION'),
            usage: '[Piece]',
            permissions: 'CLIENT_OWNER',
            category: 'admin'
        })
    }

    async run(msg, [piece]) {

        const instance = this.client.commands.get(piece);
        if (!instance) return msg.responder.error('COMMAND_DISABLE_NOPIECE');
        await this.getType(instance);

        if ((instance.type === 'command' && instance.name === 'disable') || (instance.type === 'monitor' && instance.name === 'commandHandler') || (instance.type === 'command' && instance.name === 'enable')) 
        return msg.responder.error('COMMAND_DISABLE_WARN', instance.name);
        
        await this.client.settings.push('blockedPieces', instance.name);
        return msg.responder.success();
    }

    getType(instance) {
        if (instance instanceof Command) Object.defineProperty(instance, 'type', { value: 'command' });
        return instance;
    }
}