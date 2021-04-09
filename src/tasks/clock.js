const tz = require('moment-timezone')
const moment = require('moment')
const config = require('../../lib/config');
module.exports = client => {

  const timeNow = moment().tz(config.timezone).format(config.format);
  const clockChannel = client.channels.cache.get(config.clockchannel);

  if (clockChannel === undefined) return

  clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNow}` }, 'Clock update')
  .catch(console.error);

  setInterval(() => {
  const timeNowUpdate = moment().tz(config.timezone).format(config.format);
  clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNowUpdate}` }, 'Clock update')
  .catch(console.error);

console.log(`set the time to ${timeNowUpdate}`)
  }, config.updateinterval);
}