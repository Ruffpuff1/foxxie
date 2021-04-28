const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const fs = require('fs')
require('dotenv').config()
const eventFiles = fs.readdirSync('src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.monitors = new Discord.Collection();
        
const monitorFiles = fs.readdirSync(`./src/monitors`).filter(file => file.endsWith('.js'));
for (const file of monitorFiles) {
    const monitor = require(`./src/monitors/${file}`);
    client.monitors.set(monitor.name, monitor);
	console.log(monitor.name)
    }
    

client.login(process.env.DEV)