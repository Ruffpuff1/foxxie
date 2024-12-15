const mongoose = require('mongoose')

const afkSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    afkNickname: {
        type: String,
        required: true
    },
    afkReason: {
        type: String,
        required: true
    },
    afkState: {
        type: Boolean,
        required: true
    },
    lastMsg: {
        type: String,
        required: true
    }
})

module.exports.afkSchema = mongoose.model('afk', afkSchema)