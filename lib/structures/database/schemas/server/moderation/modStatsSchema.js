const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
  }

const reqNum = {
    type: Number,
    required: false
}

const modStatsSchema = mongoose.Schema({
  guildId: reqString,
  userId: reqString,
  bans: reqNum,
  kicks: reqNum,
  warns: reqNum,
  jails: reqNum,
  mutes: reqNum,
  locks: reqNum,
  unlocks: reqNum,
  slowmodes: reqNum,
  purges: reqNum,
  nukes: reqNum,
  purgeTotal: reqNum
})

module.exports = mongoose.model('modStat', modStatsSchema)