const mongoose = require('mongoose')

const disboardMessageSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    disboardMessage: {
        type: String,
        required: true
    },
    disboardPing: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('disboardMessage', disboardMessageSchema)