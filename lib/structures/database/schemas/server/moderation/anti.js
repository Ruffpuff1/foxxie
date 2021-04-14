const mongoose = require('mongoose')

const antiSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    antiInvites: {
        type: Boolean,
        required: false
    }
})

module.exports.antiSchema = mongoose.model('anti', antiSchema)