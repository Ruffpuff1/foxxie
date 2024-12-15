const { Command } = require('@foxxie/tails');
const { emojis: { secretCommands: { strax } } } = require('~/lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'strax',
            aliases: ['straxy'],
            description: language => language.get('COMMAND_STRAX_DESCRIPTION'),
            category: 'secret'
        })
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(strax)
    }
}