const { Command } = require('foxxie');
const { emojis: { secretCommands: { dei } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'dei',
            aliases: ['connor'],
            description: language => language.get('COMMAND_DEI_DESCRIPTION'),
            category: 'secret'
        })
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(dei)
    }
}