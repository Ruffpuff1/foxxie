const mongo = require('../lib/structures/database/mongo')
const { serverSchema } = require('./structures/schemas')
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