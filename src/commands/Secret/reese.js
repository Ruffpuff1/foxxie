const Command = require('../../../lib/structures/Command');
const { emojis: { secretCommands: { reese } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reese',
            description: language => language.get('COMMAND_REESE_DESCRIPTION'),
            usage: 'fox reese',
            category: 'secret'
        })

        this.emoji = reese;
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(this.emoji[Math.floor(Math.random() * this.emoji.length)])
    }
}