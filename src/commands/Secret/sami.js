const { Command } = require('foxxie');
const { emojis: { secretCommands: { sami } } } = require('~/lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'sami',
            aliases: ['sug4r', 'samira', 'smallgar'],
            description: language => language.get('COMMAND_SAMI_DESCRIPTION'),
            category: 'secret'
        })
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(sami);
    }
}