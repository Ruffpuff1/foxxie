const mongo = require('../../lib/structures/database/mongo')
const messageCountSchema = require('../../lib/structures/database/schemas/server/messageCountSchema')
const serverMessageCountSchema = require('../../lib/structures/database/schemas/server/serverMessageCountSchema')
module.exports.userMessageCount = async (message) => {
    if (message.channel.type === 'dm') return;
    await mongo().then(async mongoose => {
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
    await mongo().then(async mongoose => {
        try {
            await serverMessageCountSchema.findOneAndUpdate({
                guildId: message.guild.id
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

module.exports.getUserMessageCount = async (message) => {
    if (message.channel.type == 'dm') return;
    await mongo().then(async mongoose => {
        try {
            this.userMsgCount = await messageCountSchema.findOne({
                guildId: message.guild.id,
                userId: message.author.id
            })
            return this.userMsgCount
        } finally {}
    })
    return this.userMsgCount
}

module.exports.getGuildMessageCount = async (message) => {
    if (message.channel.type == 'dm') return;
    await mongo().then(async mongoose => {
        try {
            this.guildMsgCount = await serverMessageCountSchema.findOne({
                guildId: message.guild.id
            })
            return this.guildMsgCount
        } finally {}
    })
    return this.guildMsgCount
}