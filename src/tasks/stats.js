const mongo = require('../../lib/structures/database/mongo')
const { serverSchema } = require('../../lib/structures/database/ServerSchemas')
const { userSchema } = require('../../lib/structures/database/UserSchema.js')
module.exports.userMessageCount = async (message) => {
    if (message.channel.type === 'dm') return;
    await mongo().then(async () => {
        let guild = `servers.${message.guild.id}.messageCount`
        try {
            await userSchema.findByIdAndUpdate({
                _id: message.author.id
            }, {
                $inc: {
                    [guild]: 1
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
            this.userMsgCount = await userSchema.findById({
                _id: userId
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

module.exports.modStatsAdd = async (message, act, total) => {
    await mongo().then(async () => {
        let guild = `servers.${message.guild.id}.modStats.${act}`
        try {
            await userSchema.findByIdAndUpdate({
                _id: message.author.id
            }, {
                $inc: {
                    [guild]: total
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}