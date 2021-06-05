const Command = require('../../../lib/structures/Command');
const { emojis: { secretCommands: { rain } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'rain',
            aliases: ['raindrop'],
            description: language => language.get('COMMAND_RAIN_DESCRIPTION'),
            usage: 'fox rain',
            category: 'secret'
        })

        this.emoji = rain;
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(this.emoji)
    }
}