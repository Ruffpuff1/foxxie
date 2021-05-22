const fs = require('fs');
const Discord = require('discord.js');
const Schedule = require('../../../lib/Schedule');

module.exports.launchEvents = client => {

    // Events
    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
    client.events = new Discord.Collection();

    for (const file of eventFiles) {
	    const event = require(`../../events/${file}`);
        client.events.set(event.name, event);
	    if (event.once) {
		    client.once(event.name, (...args) => event.execute(...args, client));
	    } else {
		    client.on(event.name, (...args) => event.execute(...args, client));
	    }
    }

    // Schedules
    client.schedule = new Schedule(client);
   
    // Montiors
    client.monitors = new Discord.Collection();
        
    const monitorFiles = fs.readdirSync(`./src/monitors`).filter(file => file.endsWith('.js'));
    for (const file of monitorFiles) {
        const monitor = require(`../../monitors/${file}`);
        client.monitors.set(monitor.name, monitor);
    }

    // Commands
    client.commands = new Discord.Collection();
    const commandFolders = fs.readdirSync('./src/commands');
        
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }

    // Languages
    client.languages = new Discord.Collection();

    const langFiles = fs.readdirSync(`./src/languages`).filter(file => file.endsWith('.js'));
    for (const file of langFiles) {
        const language = require(`../../languages/${file}`);
        client.languages.set(language.name, language);
    } 

    // Inhibitors 
    client.inhibitors = new Discord.Collection();

    const inFiles = fs.readdirSync('./src/inhibitors').filter(file => file.endsWith('.js'));
    for (const file of inFiles) {
        const inhibitor = require(`../../inhibitors/${file}`);
        client.inhibitors.set(inhibitor.name, inhibitor);
    };

    // tasks
    client.tasks = new Discord.Collection();

    const tasks = fs.readdirSync('./src/tasks').filter(file => file.endsWith('.js'));
    for (const file of tasks) {
        const task = require(`../../tasks/${file}`);
        client.tasks.set(task.name, task);
    };
}