const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'testdisboard',
            aliases: ['testbump', 'td'],
            description: language => language.get('COMMAND_DESCRIPTION_TESTDISBOARD'),
            requiredPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
            category: 'settings'
        })

        this.permissions = 'MANAGE_MESSAGES';
    }

    run(msg) {
        this.client.tasks.get('disboard').message(msg.guild);
        msg.responder.success();
    }
}