const mongoose = require('mongoose')

const serverMessageCountSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    messageCount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('server-message-counts', serverMessageCountSchema)