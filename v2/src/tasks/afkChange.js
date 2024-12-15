const mongo = require('../../lib/structures/database/mongo')
const { afkSchema } = require('../../lib/structures/database/schemas/server/moderation/afkSchema')
module.exports.setAfkNickname = async(message, nickname) => {
    await mongo().then(async () => {
        try {
            await afkSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                guildId: message.guild.id,
                userId: message.member.user.id,
                afkNickname: nickname
            }, {
                upsert: true
            })
        } finally {}
    })
}

module.exports.setAfkReason = async(message, reason) => {
    await mongo().then(async () => {
        try {
            await afkSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                guildId: message.guild.id,
                userId: message.member.user.id,
                afkReason: reason
            }, {
                upsert: true
            })
        } finally {}
    })
}

module.exports.setAfkStatus = async(message, boolean) => {
    await mongo().then(async () => {
        try {
            await afkSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                guildId: message.guild.id,
                userId: message.member.user.id,
                afkState: boolean
            }, {
                upsert: true
            })
        } finally {}
    })
}

module.exports.setAfkLastMsg = async(message) => {
    await mongo().then(async () => {
        try {
            await afkSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                guildId: message.guild.id,
                userId: message.member.user.id,
                lastMsg: message.content
            }, {
                upsert: true
            })
        } finally {}
    })
}

module.exports.getAfk = async(message, user) => {
    await mongo().then(async () => {
        try {
            this.afk = await afkSchema.findOne({
                guildId: message.guild.id,
                userId: user.id
            })
            return this.afk
        } finally {}
    })
    return this.afk
}

module.exports.delAfk = async(message) => {
    await mongo().then(async () => {
        try {
            await afkSchema.findOneAndDelete({
                guildId: message.guild.id,
                userId: message.member.user.id
            })
        } finally {}
    })
}