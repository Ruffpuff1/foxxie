const mongoose = require('mongoose')

const goodbyeChannelSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    goodbyeChannel: {
        type: String,
        required: true
    }
})

const goodbyeMessageSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    goodbyeMessage: {
        type: String,
        required: true
    }
})

module.exports.goodbyeChannelSchema = mongoose.model('GoodbyeChannel', goodbyeChannelSchema)
module.exports.goodbyeMessageSchema = mongoose.model('GoodbyeMessage', goodbyeMessageSchema)