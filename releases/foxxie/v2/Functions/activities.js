const { numOfAliases, numOfCommands, botVer, prefix } = require('../config.json');
module.exports = client => {
	const actvs = [
		`with ${client.guilds.cache.size} servers & ${client.users.cache.size} users.`,
		`v${botVer} | .help`,
		`${numOfCommands} Commands & ${numOfAliases} Aliases`,
		`v${botVer} | .help`,
		`with ${client.guilds.cache.size} servers & ${client.users.cache.size} users.`
	];
	console.log(`Activities set in ${client.guilds.cache.size} servers.`);
	client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
	setInterval(() => {
		client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
	}, 20000);
};
