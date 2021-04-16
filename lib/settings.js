const mongo = require('../lib/structures/database/mongo')
const modchannelSchema = require('../lib/structures/database/schemas/server/moderation/modchannelSchema')
const disboardChannelSchema = require('../lib/structures/database/schemas/server/disboard/disboardChannelSchema')
const { antiSchema } = require('./structures/database/schemas/server/moderation/anti')
const disboardMessageSchema = require('./structures/database/schemas/server/disboard/disboardMessageSchema')
const welcomeChannelSchema = require('./structures/database/schemas/server/welcome/welcomeChannelSchema')
const welcomeMessageSchema = require('./structures/database/schemas/server/welcome/welcomeMessageSchema')
const { goodbyeChannelSchema, goodbyeMessageSchema } = require('./structures/database/schemas/server/goodbyeSchemas')
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

module.exports.getWelcomeChannel = async (guild) => {
    await mongo().then(async () => {
        try {
            this.welcomeChannel = await welcomeChannelSchema.findById({
                _id: guild.id
            })
            return this.welcomeChannel
        } finally {}
    })
    return this.welcomeChannel
}

module.exports.getGoodbyeChannel = async (guild) => {
    await mongo().then(async () => {
        try {
            let guildID = guild.id
            this.byeChannel =  await goodbyeChannelSchema.findById({
                _id: guildID
            })
            return this.byeChannel
        } finally {}
    })
    return this.byeChannel
}

module.exports.getDisboardMessage = async (message) => {
    await mongo().then(async () => {
        try {
            this.disboardMessage = await disboardMessageSchema.findById({
                _id: message.guild.id
            })
            return this.disboardMessage
        } finally {}
    })
    return this.disboardMessage
}

module.exports.getWelcomeMessage = async (member) => {
    await mongo().then(async () => {
        try {
            this.welcomeMessage = await welcomeMessageSchema.findById({
                _id: member.guild.id
            })
            return this.welcomeMessage
        } finally {}
    })
    return this.welcomeMessage
}

module.exports.getGoodbyeMessage = async (member) => {
    await mongo().then(async () => {
        try {
            this.goodbyeMessage = await goodbyeMessageSchema.findById({
                _id: member.guild.id
            })
            return this.goodbyeMessage
        } finally {}
    })
    return this.goodbyeMessage
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