const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const userSchema = mongoose.Schema({
    _id: reqString,
    badges: {
        type: Number,
        required: true
    },
    globalBans: {
        type: Array,
        required: true
    },
    servers: {
        type: Array,
        required: true
    }
})

module.exports.userSchema = mongoose.model('user', userSchema)