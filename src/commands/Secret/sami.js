const Command = require('../../../lib/structures/Command');
const { emojis: { secretCommands: { sami } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'sami',
            aliases: ['sug4r', 'samira'],
            description: language => language.get('COMMAND_SAMI_DESCRIPTION'),
            usage: 'fox sami',
            category: 'secret'
        })

        this.emoji = sami;
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(this.emoji)
    }
}