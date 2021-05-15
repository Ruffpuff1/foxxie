const { botSettingsSchema } = require("../../../lib/structures/database/BotSettingsSchema")
const mongo = require("../../../lib/structures/database/mongo")
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

        key = key.replace(/-/g, '')

        await mongo().then(async () => {
            try { 
                const client = await botSettingsSchema.findById(
                { _id: '812546582531801118' })
                
                const badgesUser = await message.author.settings.get('badges')

                const found = client.keys.find(item => item.key === key);
                if (!found) return language.send('COMMAND_REDEEM_NOEXIST', lang);
                language.send('COMMAND_REDEEM_SUCCESS', lang, badges[found.id].icon, badges[found.id].name);

                await message.author.settings.set('badges', badgesUser | ( 1 << found.id ))
                await botSettingsSchema.findByIdAndUpdate(
                    { _id: '812546582531801118' },
                    { _id: '812546582531801118',
                        $pull: { keys: found } }
                )

            } finally {}
        })
    }
}