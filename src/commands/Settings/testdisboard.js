const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'testdisboard',
            aliases: ['testbump', 'td'],
            description: language => language.get('COMMAND_DESCRIPTION_TESTDISBOARD'),
            permissions: 'MANAGE_MESSAGES',
            category: 'settings'
        })
    }

    run(msg) {
        this.client.tasks.get('disboard').message(msg.guild);
        msg.responder.success();
    }
}