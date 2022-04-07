const tz = require('moment-timezone');
const moment = require('moment');
const { clockchannel, timezone, format, updateinterval } = require('../config.json');
module.exports = client => {
	const timeNow = moment().tz(timezone).format(format);
	const clockChannel = client.channels.cache.get(clockchannel);
	clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNow}` }, 'Clock update').catch(console.error);
	setInterval(() => {
		const timeNowUpdate = moment().tz(timezone).format(format);
		clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNowUpdate}` }, 'Clock update').catch(console.error);
		console.log(`set the time to ${timeNowUpdate}`);
	}, updateinterval);
};
