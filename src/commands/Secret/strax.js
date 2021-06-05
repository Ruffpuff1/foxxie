const Command = require('../../../lib/structures/Command');
const { emojis: { secretCommands: { strax } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'strax',
            aliases: ['straxy'],
            description: language => language.get('COMMAND_STRAX_DESCRIPTION'),
            usage: 'fox strax',
            category: 'secret'
        })

        this.emoji = strax;
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(this.emoji)
    }
}