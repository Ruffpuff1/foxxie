const Command = require('../../../lib/structures/Command');
const { emojis: { secretCommands: { ruff } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ruff',
            description: language => language.get('COMMAND_RUFF_DESCRIPTION'),
            usage: 'fox ruff',
            category: 'secret'
        })

        this.emoji = ruff;
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(this.emoji)
    }
}