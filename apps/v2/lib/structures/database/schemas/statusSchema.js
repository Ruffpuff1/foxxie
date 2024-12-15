const mongoose = require('mongoose')

const statusSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports.statusSchema = mongoose.model('status', statusSchema)