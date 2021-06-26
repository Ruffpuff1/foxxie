const { Command } = require('@foxxie/tails');
const { emojis: { secretCommands: { ashlee } } } = require('~/lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ash',
            aliases: ['ashlee', 'snow'],
            description: language => language.get('COMMAND_ASH_DESCRIPTION'),
            category: 'secret'
        })
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(ashlee);
    }
}