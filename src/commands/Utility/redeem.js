const { badges } = require("../../../lib/util/constants")
module.exports = {
    name: 'redeem',
    aliases: ['redeemkey'],
    usage: 'fox redeem [key]',
    category: 'utility',
    execute: async(props) => {

        let { message, args, language, lang } = props

        let key = args[0];
        if (!key) return language.send('COMMAND_REDEEM_NOKEY', lang);

        key = key.replace(/-/g, '');
        message.client.keys = await message.client.framework.get('keys');
                
        const badgesUser = await message.author.settings.get('badges')
        const found = message.client.keys.find(item => item.key === key);
        if (!found) return language.send('COMMAND_REDEEM_NOEXIST', lang);

        language.send('COMMAND_REDEEM_SUCCESS', lang, badges[found.id].icon, badges[found.id].name);
        message.author.settings.set('badges', badgesUser | ( 1 << found.id ))
        message.client.framework.pull('keys', found);
    }
}