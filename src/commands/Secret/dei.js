const Command = require('../../../lib/structures/Command');
const { emojis: { secretCommands: { dei } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'dei',
            aliases: ['connor'],
            description: language => language.get('COMMAND_DEI_DESCRIPTION'),
            usage: 'fox dei',
            category: 'secret'
        })

        this.emoji = dei;
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(this.emoji)
    }
}