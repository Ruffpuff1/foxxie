const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reboot',
            aliases: ['restart'],
            description: language => language.get('COMMAND_REBOOT_DESCRIPTION'),
            permissions: 'CLIENT_OWNER',
            category: 'admin'
        })
    }

    async run(msg) {
        await msg.responder.info('COMMAND_REBOOT').catch(() => null);
        process.exit();
    }
}