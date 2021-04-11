const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
const eventFiles = fs.readdirSync('src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


const config = require('../lib/config')
const reminder = require('./tasks/reminder')
const afkcheck = require('./tasks/afkcheck')
const membercount = require('./tasks/membercount')
const mongo = require('../lib/structures/database/mongo')

client.on('ready', async () => {
    /*
    console.log('The client is ready!')
    reminder(client)
    afkcheck(client)
    membercount(client)
*/
    module.exports = {

        USERS: client.users.cache.size,
        GUILDS: client.guilds.cache.size,
        USERCLIENT: client.user,
        UPTIME: client.uptime,
        CLIENT: client
    }

const connectToMongoDB = async () => {
    await mongo().then(mongoose => {
        try {
            console.log(`Connected to MongoDB`)
        } finally {}
    })
}

connectToMongoDB()

})

client.login(config.token)