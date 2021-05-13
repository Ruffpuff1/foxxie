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
        type: Object,
        required: true
    },
    roleplayStats: {
        type: Object,
        required: true
    }
})

module.exports.userSchema = mongoose.model('user', userSchema)