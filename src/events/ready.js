const { mongoDB } = require('../../lib/Database');
const { memberCount, clock } = require('../../lib/util/theCornerStore');
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
        client.tasks.get('endTempmute').execute(client);
        client.tasks.get('endTempban').execute(client);
        // The Corner Store, memberCount & clock
        // memberCount(client);
        // clock(client);

        const actvs = [
            `with ${client.guilds.cache.size.toLocaleString()} servers & ${client.users.cache.size.toLocaleString()} users.`,
            `v${version} | fox help`,
            `with ${commands} Commands & ${aliases} Aliases`,
            `v${version} | fox support`,
            `Happy pride month!`];
        
        client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
        setInterval(() => client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]), 30000);
	},
};