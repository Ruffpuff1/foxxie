const mongo = require('../lib/structures/database/mongo')
const { serverSchema } = require('../lib/structures/schemas')
module.exports.serverSettings = async (message) => {
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