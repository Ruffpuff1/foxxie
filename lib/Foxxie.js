const { Client, Collection } = require('discord.js');
const fs = require('fs');
const Schedule = require('../lib/Schedule');
const FoxxieSettings = require('./extensions/Client');

class Foxxie extends Client {
    constructor(options) {
        super(options);
        this.framework = new FoxxieSettings(this);
        this.schedule = new Schedule(this);
        this.events = new Collection();
        this.monitors = new Collection();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.languages = new Collection();
        this.inhibitors = new Collection();
        this.tasks = new Collection();
        this.launchEvents();
        this.launchMonitors();
        this.launchLanguages();
        this.launchCommands();
        this.launchInhibitors();
        this.launchTasks();
    }
    // Read event files and launches events.
    launchEvents() {
        const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../src/events/${file}`);
            this.events.set(event.name, event);
            if (event.one) this.once(event.name, (...args) => event.execute(...args, this));
            else this.on(event.name, (...args) => event.execute(...args, this));
        }
    }
    // Read monitor files and launches monitors.
    launchMonitors() {
        const monitorFiles = fs.readdirSync(`./src/monitors`).filter(file => file.endsWith('.js'));
        for (const file of monitorFiles) {
            const monitor = require(`../src/monitors/${file}`);
            this.monitors.set(monitor.name, monitor);
        }
    }

    launchCommands(msg) {
        const commandFolders = fs.readdirSync('./src/commands');
        const aliasArr = [];

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../src/commands/${folder}/${file}`);
                if (typeof command === 'function') {
                    let cmd;
                    if (msg) cmd = new command(msg.language);
                    if (!msg) cmd = new command();
                    this.commands.set(file.substring(0, file.length -3), cmd);
                }



                // this.commands.set(file.substring(0, file.length -3), command);

                // const struc = this.commands.get(file.substring(0, file.length -3))
                // if (typeof struc === 'function') {
                //     const cmd = new struc();
                //     let aliases = cmd.language.aliases;
                //     if (aliases) aliasArr.push(cmd);
                // }
            }
        }
        // aliasArr.forEach(a => this.aliases.set(a.language.name, a))
    }

    launchLanguages() {
        const langFiles = fs.readdirSync(`./src/languages`).filter(file => file.endsWith('.js'));
        for (const file of langFiles) {
            const language = require(`../src/languages/${file}`);
            this.languages.set(language.name, language);
        } 
    }

    launchInhibitors() {
        const inFiles = fs.readdirSync('./src/inhibitors').filter(file => file.endsWith('.js'));
        for (const file of inFiles) {
            const inhibitor = require(`../src/inhibitors/${file}`);
            this.inhibitors.set(inhibitor.name, inhibitor);
        };
    }

    launchTasks() {
        const tasks = fs.readdirSync('./src/tasks').filter(file => file.endsWith('.js'));
        for (const file of tasks) {
            const task = require(`../src/tasks/${file}`);
            this.tasks.set(task.name, task);
        };
    }
}

module.exports = Foxxie;