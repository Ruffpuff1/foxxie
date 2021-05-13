const fs = require('fs');
const Discord = require('discord.js');

module.exports.launchEvents = (client) => {

    // Events
    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
	    const event = require(`../events/${file}`);
	    if (event.once) {
		    client.once(event.name, (...args) => event.execute(...args, client));
	    } else {
		    client.on(event.name, (...args) => event.execute(...args, client));
	    }
    }


    // Montiors
    client.monitors = new Discord.Collection();
        
    const monitorFiles = fs.readdirSync(`./src/monitors`).filter(file => file.endsWith('.js'));
    for (const file of monitorFiles) {
        const monitor = require(`../monitors/${file}`);
        client.monitors.set(monitor.name, monitor);
    }


    // Commands
    client.commands = new Discord.Collection();
    const commandFolders = fs.readdirSync('./src/commands');
        
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }
 
}