const mongoose = require('mongoose')

const welcomeChannelSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    welcomeChannel: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('WelcomeChannel', welcomeChannelSchema)