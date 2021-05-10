const { botSettingsSchema } = require("../../../lib/structures/database/BotSettingsSchema")
const mongo = require("../../../lib/structures/database/mongo")
const { userSchema } = require("../../../lib/structures/database/UserSchema")
const { badges } = require("../../../lib/util/constants")
module.exports = {
    name: 'redeem',
    aliases: ['redeemkey'],
    usage: 'fox redeem [key]',
    category: 'utility',
    execute: async(props) => {

        let { message, args, language, lang } = props

        let key = args[0]
        if (!key) return message.channel.send(language.get('COMMAND_REDEEM_NOKEY', lang))

        key = key.replace(/-/g, '')

        await mongo().then(async () => {
            try { 
                const client = await botSettingsSchema.findById(
                { _id: '812546582531801118' })
                
                const user = await userSchema.findById(
                    { _id: message.author.id } ) 

                const found = client.keys.find(item => item.key === key);
                if (!found) return message.channel.send(language.get('COMMAND_REDEEM_NOEXIST', lang));
                message.channel.send(language.get('COMMAND_REDEEM_SUCCESS', lang, badges[found.id].icon, badges[found.id].name))

                await userSchema.findByIdAndUpdate(
                    { _id: message.author.id },
                    { _id: message.author.id, badges: user.badges | ( 1 << found.id ) } ) 

                await botSettingsSchema.findByIdAndUpdate(
                    { _id: '812546582531801118' },
                    { _id: '812546582531801118',
                        $pull: { keys: found } }
                )

            } finally {}
        })
    }
}