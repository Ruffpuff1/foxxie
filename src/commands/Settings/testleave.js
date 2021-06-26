const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'testleave',
            aliases: ['testbye', 'tl'],
            description: language => language.get('COMMAND_TESTLEAVE_DESCRIPTION'),
            usage: '[Member]',
            permissions: 'MANAGE_MESSAGES',
            category: 'settings'
        })
    }

    run(msg) {
        const member = msg.members.shift() || msg.member;
        this.client.emit('guildMemberRemove', member);
        msg.responder.success();
    }
}