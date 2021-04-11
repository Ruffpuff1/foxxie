const mongoose = require('mongoose')

const messageCountSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    messageCount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('message-counts', messageCountSchema)