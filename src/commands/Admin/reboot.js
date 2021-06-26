const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reboot',
            aliases: ['restart'],
            description: language => language.get('COMMAND_REBOOT_DESCRIPTION'),
            permissionLevel: 10,
            category: 'admin'
        })
    }

    async run(msg) {
        await msg.responder.info('COMMAND_REBOOT').catch(() => null);
        process.exit();
    }
}