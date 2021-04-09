const reminder = require('../tasks/reminder')
const config = require('../../lib/config');
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// logs "ready"
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// activities

		const actvs = [
			`v${config.botVer} | .help`,
			`${config.numOfCommands} Commands & ${config.numOfAliases} Aliases`,
			`v${config.botVer} | .invite`,
			`v${config.botVer} | .support`,
			`with ${client.guilds.cache.size} servers & ${client.users.cache.size} users.`];
	
		console.log(`Activities set in ${client.guilds.cache.size} servers.`)
	
		client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length))]);
		setInterval(() => {
			client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length))]);
		}, 20000);

        reminder(client)
	},
};