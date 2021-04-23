const mongo = require('../../lib/structures/database/mongo')
const { serverSchema } = require('../../lib/structures/schemas')
const messageCountSchema = require('../../lib/structures/database/schemas/server/messageCountSchema')
module.exports.userMessageCount = async (message) => {
    if (message.channel.type === 'dm') return;
    await mongo().then(async () => {
        try {
            await messageCountSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.author.id
            }, {
                $inc: {
                    'messageCount': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.guildMessageCount = async (message) => {
    if (message.channel.type === 'dm') return;
    await mongo().then(async () => {
        try {
            await serverSchema.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                $inc: {
                    'messageCount': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.getUserMessageCount = async (message, userId) => {
    if (message.channel.type == 'dm') return;
    await mongo().then(async () => {
        try {
            this.userMsgCount = await messageCountSchema.findOne({
                guildId: message.guild.id,
                userId: userId
            })
            return this.userMsgCount
        } finally {}
    })
    return this.userMsgCount
}

module.exports.getGuildMessageCount = async (message, server) => {
    if (message.channel.type == 'dm') return;
    await mongo().then(async () => {
        try {
            this.guildMsgCount = await serverSchema.findById({
                _id: server
            })
            return this.guildMsgCount
        } finally {}
    })
    return this.guildMsgCount
}