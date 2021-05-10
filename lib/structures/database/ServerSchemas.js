const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const reqObj = {
    type: Object,
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

    welcome: reqObj,
    goodbye: reqObj,
    disboard: reqObj,
    starboard: reqObj,
    log: reqObj,
    anti: reqObj,

    tags: {
        type: Array,
        required: true
    },

    editChannel: reqString,
    deleteChannel: reqString,
    modChannel: reqString,
    welcomeChannel: reqString,
    welcomeMessage: reqString,
    goodbyeChannel: reqString,
    goodbyeMessage: reqString,
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
        type: Array,
        required: true
    },
    blockedChannels: {
        type: Array,
        required: true
    },
    reros: {
        type: Array,
        required: true
    }
})

module.exports.serverSchema = mongoose.model('server', serverSchema)