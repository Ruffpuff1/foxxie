const reminder = require('../tasks/reminder')
const { disboard } = require('../tasks/disboard')
const { mongoDB } = require('../../lib/structures/database/mongoDB')
const { memberCount, clock } = require('../../lib/util/theCornerStore')
const { stats } = require('../../lib/util/stats')
const { botVer, numOfAliases, numOfCommands } = require('../../lib/config')
module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
		// logs "ready", runs connection to mongoDB
		console.log(`Ready! Logged in as ${client.user.tag}`)
        mongoDB()
        // Botwide
        reminder(client)
        // afkcheck(client)
        disboard(client)
        // The Corner Store, memberCount & clock
        memberCount(client)
        clock(client)

        // stats(client)
        // setInterval(() => {
        //     stats(client)
        // }, 10000)

        const actvs = [
            `with ${client.guilds.cache.size.toLocaleString()} servers & ${client.users.cache.size.toLocaleString()} users.`,
            `v${botVer} | fox help`,
            `${numOfCommands} Commands & ${numOfAliases} Aliases`,
            `v${botVer} | fox support`];
        
        client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
            setInterval(() => {
        client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
            }, 20000);

	},
};