const mongo = require('../../lib/structures/database/mongo')
const modStatsSchema = require('../../lib/structures/database/schemas/server/moderation/modStatsSchema')
module.exports.addBan = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'bans': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addKick = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'kicks': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addWarn = async (member) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: member.guild.id,
                userId: member.user.id
            }, {
                $inc: {
                    'warns': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addJail = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'jails': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addMute = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'mutes': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addLock = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'locks': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addUnlock = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'unlocks': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addSlowmode = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'slowmodes': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addPurge = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'purges': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addNuke = async (message) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'nukes': 1
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.addTotal = async (message, total) => {
    await mongo().then(async () => {
        try {
            await modStatsSchema.findOneAndUpdate({
                guildId: message.guild.id,
                userId: message.member.user.id
            }, {
                $inc: {
                    'purgeTotal': total
                }
            }, {
                upsert: true
            }).exec()
        } finally {}
    })
}

module.exports.getModCount = async (message, member) => {
    await mongo().then(async () => {
        try {
            this.modCount = await modStatsSchema.findOne({
                guildId: message.guild.id,
                userId: member.user.id
            })
            return this.modCount
        } finally {}
    })
    return this.modCount
}