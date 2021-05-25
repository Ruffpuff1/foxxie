const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const foxxieSchema = mongoose.Schema({
    _id: reqString,
    keys: { type: Array, required: true },
    stats: { type: Object, required: true },
    gifs: { type: Object, required: true },
    blockedCommands: { type: Array, required: true },
    blockedUsers: { type: Array, required: true },
    blockedGuilds: { type: Array, required: true },
    schedule: { type: Object, required: true },
    status: reqString,
    statusMessage: reqString
})

module.exports.foxxieSchema = mongoose.model('Foxxie', foxxieSchema, 'foxxie');