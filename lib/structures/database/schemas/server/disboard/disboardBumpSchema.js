const mongoose = require('mongoose')

const disboardBumpSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    disboardBump: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('disboardBump', disboardBumpSchema)