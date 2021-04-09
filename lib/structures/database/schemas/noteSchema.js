const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  notes: {
    type: [Object],
    required: true
  }
})

module.exports = mongoose.model('notes', noteSchema)