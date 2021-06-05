const Command = require('../../../lib/structures/Command');
const { emojis: { secretCommands: { ashlee } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ash',
            aliases: ['ashless'],
            description: language => language.get('COMMAND_ASH_DESCRIPTION'),
            usage: 'fox ash',
            category: 'secret'
        })

        this.emoji = ashlee;
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(this.emoji)
    }
}