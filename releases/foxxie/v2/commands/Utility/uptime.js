const { botVer } = require('../../config.json');
module.exports = {
	name: 'stats',
	description: 'Shows Uptime of bot',
	aliases: ['up', 'uptime'],
	usage: 'stats',
	execute: async (client, message, args) => {
		let days = Math.floor(client.uptime / 86400000);
		let hours = Math.floor(client.uptime / 3600000) % 24;
		let minutes = Math.floor(client.uptime / 60000) % 60;
		let seconds = Math.floor(client.uptime / 1000) % 60;

		message.channel.send(`Hello! Foxxie **v${botVer}** has been last rebooted **${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds ago.**`);
	}
};
