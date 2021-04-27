const mongo = require('../lib/structures/database/mongo')
const { serverSchema } = require('./structures/schemas')
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

module.exports.deleteLogSetting = async (msg, use) => {
    if (msg.guild == undefined) return;
    await mongo().then(async () => {
        try {
            if (use.toLowerCase() === 'mod'){
                await serverSchema.findByIdAndUpdate({
                    _id: msg.guild.id
                }, {
                    _id: msg.guild.id,
                    $unset: {
                        modChannel: ''
                    }
                })
                return msg.react(approved)
            }
            if (use.toLowerCase() === 'edit'){
                await serverSchema.findByIdAndUpdate({
                    _id: msg.guild.id
                }, {
                    _id: msg.guild.id,
                    $unset: {
                        editChannel: ''
                    }
                })
                return msg.react(approved)
            }
            if (use.toLowerCase() === 'delete'){
                await serverSchema.findByIdAndUpdate({
                    _id: msg.guild.id
                }, {
                    _id: msg.guild.id,
                    $unset: {
                        deleteChannel: ''
                    }
                })
                return msg.react(approved)
            }
        } finally {}
    })
}