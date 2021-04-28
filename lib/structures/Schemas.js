const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const serverSchema = mongoose.Schema({
    _id: reqString,
    messageCount: {
        type: Number,
        required: true
    },
    prefix: reqString,
    language: reqString,
    editChannel: reqString,
    deleteChannel: reqString,
    welcomeChannel: reqString,
    welcomeMessage: reqString,
    goodbyeChannel: reqString,
    goodbyeMessage: reqString,
    modChannel: reqString,
    starChannel: reqString,
    starMinimum: {
        type: Number,
        required: true
    },
    disboardChannel: reqString,
    disboardMessage: reqString,
    disboardPing: reqString,
    disboardBump: {
        type: Boolean,
        required: true
    },
    antiInvite: {
        type: Boolean,
        required: true
    },
    blockedUsers: {
        type: [Array],
        required: true
    },
    blockedChannels: {
        type: [Array],
        required: true
    },
    reros: {
        type: [Array],
        required: true
    }
})

module.exports.serverSchema = mongoose.model('Server', serverSchema)