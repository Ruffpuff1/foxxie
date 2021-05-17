const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const reqArr = {
    type: [Array],
    required: true
}

const botSettingsSchema = mongoose.Schema({
    _id: reqString,
    keys: { type: Array, required: true },
    stats: { type: Object, required: true },
    gifs: { type: Object, required: true },
    blockedCommands: { type: Array, required: true },
    blockedUsers: { type: Array, required: true },
    blockedGuilds: { type: Array, required: true },
    status: reqString,
    statusMessage: reqString,
    blacklistedUsers: reqArr,
    contributors: reqArr,
    cutiepie: reqArr,
    sisterBot: reqArr
})

module.exports.botSettingsSchema = mongoose.model('bot-setting', botSettingsSchema);