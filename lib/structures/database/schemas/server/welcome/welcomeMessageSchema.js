const mongoose = require('mongoose')

const welcomeMessageSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    welcomeMessage: {
        type: String,
        required: true
    },
    welcomePing: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('welcomeMessage', welcomeMessageSchema)