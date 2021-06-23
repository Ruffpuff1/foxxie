const guildMemberAdd = require('../../events/guildMemberAdd');
const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'testjoin',
            aliases: ['testwelcome', 'tw'],
            description: language => language.get('COMMAND_TESTJOIN_DESCRIPTION'),
            usage: '[Member]',
            permissions: 'MANAGE_MESSAGES',
            category: 'settings'
        })
    }

    run(msg) {
        const member = msg.members.shift() || msg.member;
        this.client.emit('guildMemberAdd', member);
        msg.responder.success();
    }
}