const { Command } = require('@foxxie/tails');
const { emojis: { secretCommands: { reese } } } = require('~/lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reese',
            description: language => language.get('COMMAND_REESE_DESCRIPTION'),
            category: 'secret'
        })
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(reese[Math.floor(Math.random() * reese.length)]);
    }
}