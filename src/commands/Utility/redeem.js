const { badges } = require("../../../lib/util/constants");
const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'redeem',
            aliases: ['redeemkey'],
            description: language => language.get('COMMAND_REDEEM_DESCRIPTION'),
            usage: '[Key]',
            category: 'utility'
        })
    }

    async run(msg, [key]) {
        if (!key) return msg.responder.error('COMMAND_REDEEM_NOKEY');
        key = key.replace(/-/g, '');
        const keys = await this.client.settings.get('keys');

        const badgesUser = await msg.author.settings.get('badges')
        const found = keys.find(item => item.key === key);
        if (!found) return msg.responder.error('COMMAND_REDEEM_NOEXIST');

        msg.responder.success('COMMAND_REDEEM_SUCCESS', badges[found.id].icon, badges[found.id].name);
        msg.author.settings.set('badges', badgesUser | ( 1 << found.id ))
        msg.client.settings.pull('keys', found);
    }
}