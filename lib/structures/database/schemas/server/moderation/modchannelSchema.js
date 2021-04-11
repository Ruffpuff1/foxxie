const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
  }

const modchannelSchema = mongoose.Schema({
    _id: reqString,
    channelId: reqString
    }
)

module.exports = mongoose.model('modchannels', modchannelSchema)