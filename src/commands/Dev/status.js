const mongo = require('../../../lib/structures/database/mongo')
const { botSettingsSchema } = require("../../../lib/structures/database/BotSettingsSchema")
module.exports = {
    name: 'status',
    aliases: ['state', 'update'],
    usage: 'fox status [status] (message)',
    permissionLevel: 9,
    category: 'developer',
    execute: async(props) => {

        let { message, args } = props

        let status = args[0]
        let msg = args.slice(1).join(' ')
        if (!msg && !status) msg = 'The bot seems to be offline for some reason.', status = 'offline'
        if (!msg) msg = "Everything seems to be running smoothly."

        await mongo().then(async () => {
            try {
                await botSettingsSchema.findByIdAndUpdate({
                    _id: '812546582531801118'
                }, {
                    _id: '812546582531801118',
                    status: status,
                    message: msg
                }, {
                    upsert: true
                })
                message.delete()
            } finally {}
        })
    }
}