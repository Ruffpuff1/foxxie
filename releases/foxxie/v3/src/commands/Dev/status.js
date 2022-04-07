const mongo = require('../../../lib/structures/database/mongo')
const config = require('../../../lib/config')
const { statusSchema } = require('../../../lib/structures/database/schemas/statusSchema')
module.exports = {
    name: 'status',
    aliases: ['state', 'update'],
    usage: 'fox status [status] (message)',
    category: 'developer',
    execute: async(lang, message, args) => {

        if (!config.devs.includes(message.author.id)) return;

        let status = args[0]
        let msg = args.slice(1).join(' ')
        if (!msg && !status) msg = 'The bot seems to be offline for some reason.', status = 'offline'
        if (!msg) msg = "Everything seems to be running smoothly."

        await mongo().then(async () => {
            try {
                await statusSchema.findByIdAndUpdate({
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