const { mongoDB } = require('../../lib/Database');
const { memberCount, clock } = require('../../lib/util/theCornerStore');
const { stats } = require('../../lib/util/stats');
const { version, commands, aliases } = require('../../config/foxxie');
module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
		// logs "ready", runs connection to mongoDB
		console.log(`[${client.user.username}] Ready! Logged in with ${client.commands.size} commands.`);
        mongoDB();
        // Botwide
        client.tasks.get('reminder').execute(client);
        client.tasks.get('disboard').execute(client);
        // The Corner Store, memberCount & clock
        // memberCount(client);
        // clock(client);

        stats(client);
        setInterval(() => stats(client), 15000);

        const actvs = [
            `with ${client.guilds.cache.size.toLocaleString()} servers & ${client.users.cache.size.toLocaleString()} users.`,
            `v${version} | fox help`,
            `with ${commands} Commands & ${aliases} Aliases`,
            `v${version} | fox support`];
        
        client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
        setInterval(() => client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]), 20000);
	},
};