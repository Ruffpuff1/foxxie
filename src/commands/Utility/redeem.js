const { badges } = require("../../../lib/util/constants")
module.exports = {
    name: 'redeem',
    aliases: ['redeemkey'],
    usage: 'fox redeem [key]',
    category: 'utility',
    execute: async(props) => {

        let { message, args } = props

        let key = args[0];
        if (!key) return message.responder.error('COMMAND_REDEEM_NOKEY',);

        key = key.replace(/-/g, '');
        message.client.keys = await message.client.settings.get('keys');
                
        const badgesUser = await message.author.settings.get('badges')
        const found = message.client.keys.find(item => item.key === key);
        if (!found) return message.responder.error('COMMAND_REDEEM_NOEXIST');

        message.responder.success('COMMAND_REDEEM_SUCCESS', badges[found.id].icon, badges[found.id].name);
        message.author.settings.set('badges', badgesUser | ( 1 << found.id ))
        message.client.settings.pull('keys', found);
    }
}