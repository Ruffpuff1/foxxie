const mongoose = require('mongoose')

const disboardChannelSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    disboardChannel: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('disboardChannel', disboardChannelSchema)