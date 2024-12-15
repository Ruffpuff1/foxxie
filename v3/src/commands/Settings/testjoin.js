const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'testjoin',
            aliases: ['testwelcome', 'tw'],
            description: language => language.get('COMMAND_TESTJOIN_DESCRIPTION'),
            requiredPermissions: ['ADD_REACTIONS'],
            usage: '[Member]',
            category: 'settings'
        })

        this.permissions = 'MANAGE_MESSAGES';
    }

    run(msg) {
        const member = msg.members.shift() || msg.member;
        this.client.emit('guildMemberAdd', member);
        msg.responder.success();
    }
}