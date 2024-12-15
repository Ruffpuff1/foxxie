const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'say',
            aliases: ['speak', 'message'],
            description: language => language.get('COMMAND_SAY_DESCRIPTION'),
            requiredPermissions: ['MANAGE_MESSAGES'],
            usage: '[...Message]',
            permissions: 'MANAGE_MESSAGES',
            category: 'utility'
        });
    }

    run(msg, [...text]) {
        msg.delete();
        if (!text.length) return msg;
        msg.channel.send(text.join(' '))
    }
}