const mongoose = require('mongoose')

const reqString = { type: String, required: true }

const serverSchema = mongoose.Schema({
    _id: reqString,
    messageCount: { type: Number, required: true },
    prefixes: { type: Array, required: true },
    language: { type: String, required: true },
    welcome: { type: Object, required: true },
    goodbye: { type: Object, required: true },
    disboard: { type: Object, required: true },
    starboard: { type: Object, required: true },
    log: { type: Object, required: true },
    anti: { type: Object, required: true },
    mod: { type: Object, required: true },
    regexTags: { type: Object, required: true },
    tags: { type: Array, required: true },
    blockedUsers: { type: Array, required: true },
    blockedChannels: { type: Array, required: true },
    reros: { type: Array, required: true },

    editChannel: reqString,
    deleteChannel: reqString,
    modChannel: reqString,
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
    }
})

module.exports.serverSchema = mongoose.model('server', serverSchema)