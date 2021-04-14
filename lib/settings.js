const mongo = require('../lib/structures/database/mongo')
const modchannelSchema = require('../lib/structures/database/schemas/server/moderation/modchannelSchema')
const disboardChannelSchema = require('../lib/structures/database/schemas/server/disboard/disboardChannelSchema')
const { antiSchema } = require('./structures/database/schemas/server/moderation/anti')
module.exports.getGuildModChannel = async (message) => {
    await mongo().then(async () => {
        try {
            let guildID = message.guild.id
            this.modchannel =  await modchannelSchema.findById({
                _id: guildID
            })
            return this.modchannel
        } finally {}
    })
    return this.modchannel
}

module.exports.getDisboardChannel = async (message) => {
    await mongo().then(async () => {
        try {
            this.disboardChannel = await disboardChannelSchema.findById({
                _id: message.guild.id
            })
            return this.disboardChannel
        } finally {}
    })
    return this.disboardChannel
}

module.exports.antiInvitesEnabled = async (message) => {
    await mongo().then(async () => {
        try {
            this.antiInvites = await antiSchema.findById({
                _id: message.guild.id
            })
            return this.antiInvites
        } finally {}
    })
    return this.antiInvites
}