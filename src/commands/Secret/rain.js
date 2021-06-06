const { Command } = require('foxxie');
const { emojis: { secretCommands: { rain } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'rain',
            aliases: ['raindrop'],
            description: language => language.get('COMMAND_RAIN_DESCRIPTION'),
            category: 'secret'
        })
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(rain);
    }
}