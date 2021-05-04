const mongo = require('../lib/structures/database/mongo')
const { serverSchema } = require('./structures/database/ServerSchemas')
const { emojis: { approved } } = require('../lib/util/constants')
module.exports.serverSettings = async (message) => {
    if (message.guild == undefined) return;
    await mongo().then(async () => {
        try {
            this.server = await serverSchema.findById({
                _id: message.guild.id
            })
            return this.server
        } finally {}
    })
    return this.server
}

module.exports.deleteServerSetting = async (msg, use) => {
    if (msg.guild == undefined) return;
    await mongo().then(async () => {
        try {
                await serverSchema.findByIdAndUpdate({
                    _id: msg.guild.id
                }, {
                    _id: msg.guild.id,
                    $unset: {
                        [use]: ''
                    }
                })
                return msg.react(approved)
        } finally {}
    })
}