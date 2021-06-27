const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'testleave',
            aliases: ['testbye', 'tl'],
            description: language => language.get('COMMAND_TESTLEAVE_DESCRIPTION'),
            requiredPermissions: ['ADD_REACTIONS'],
            usage: '[Member]',
            category: 'settings'
        })

        this.permissions = 'MANAGE_MESSAGES';
    }

    run(msg) {
        const member = msg.members.shift() || msg.member;
        this.client.emit('guildMemberRemove', member);
        msg.responder.success();
    }
}