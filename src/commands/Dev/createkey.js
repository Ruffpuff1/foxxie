const { owner } = require("../../../config/foxxie");
const { botSettingsSchema } = require("../../../lib/structures/database/BotSettingsSchema")
const mongo = require("../../../lib/structures/database/mongo")
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'createkey',
    aliases: ['crk', 'profilebadge'],
    category: 'developer',
    usage: 'fox createkey [add|remove] [badge] [user]',
    execute: async (props) => {

        let { message, args } = props

        if (!owner.includes(msg.author.id)) return;

        let user = msg.mentions.users.first() || msg.client.users.cache.get(args[2])

        validCase = ["add", "remove"]
        validBadge = ["contributor", "cutiepie", "sister"]

        if (!args[0] || !validCase.includes(args[0].toLowerCase())) return msg.channel.send(`**Please,** specify a proper use case [add|remove].`)
        if (!args[1] || !validBadge.includes(args[1].toLowerCase())) return msg.channel.send(`**Please,** specify a proper badge [contributor|cutiepie|sister].`)

        if (!user) return msg.channel.send(`**Please,** provide a user @mention or id to add the badge to.`)

        let action; let badge;
        if (args[0].toLowerCase() === 'add') action = '$push'
        if (args[0].toLowerCase() === 'remove') action = '$pull'

        if (args[1].toLowerCase() === 'contributor') badge = 'contributors'
        if (args[1].toLowerCase() === 'cutiepie') badge = 'cutiepie'
        if (args[1].toLowerCase() === 'sister') badge = 'sisterBot'

        await mongo().then(async () => {
            try {
                await botSettingsSchema.findByIdAndUpdate({
                    _id: '812546582531801118'
                }, {
                    _id: '812546582531801118',
                    [action]: {
                        [badge]: user.id
                    }
                }, { upsert: true })
                msg.react(approved)
            } finally {}
        })

    }
}