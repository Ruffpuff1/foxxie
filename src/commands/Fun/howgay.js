const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'howgay',
            aliases: ['how-homo'],
            description: language => language.get('COMMAND_HOWGAY_DESCRIPTION'),
            usage: '(Member)',
            category: 'fun'
        })
    }

    run(msg) {

        const member = msg.members?.length ? msg.members[0] : msg.member;
        const percentage = Math.round(Math.random() * 100);
        msg.responder.success('COMMAND_HOWGAY', member.displayName, percentage)
    }
}