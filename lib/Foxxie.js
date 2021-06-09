const { Client, Collection, Permissions, Permissions: { FLAGS } } = require('discord.js');
const fs = require('fs');
const Schedule = require('../lib/Schedule');
const { Event, EventStore, Util } = require('foxxie');
const FoxxieSettings = require('./extensions/Client');
const CommandStore = require('./CommandStore'), LanguageStore = require('./LanguageStore');

class Foxxie extends Client {
    constructor(options) {


        super(options);

        this.aliases = new Collection();
        /**
		 * The cache where commands are stored
		 * @since 3.0
		 * @type {CommandStore}
		 */
        this.commands = new CommandStore(this);

        this.inhibitors = new Collection();

        this.monitors = new Collection();
        /**
		 * The cache where languages are stored
		 * @since 3.0
		 * @type {LanguageStore}
		 */
        this.languages = new LanguageStore(this);

        this.events = new EventStore(this);

        this.tasks = new Collection();

        this.settings = new FoxxieSettings(this);

        this.schedule = new Schedule(this);

        this.launchEvents();
        this.launchMonitors();
        this.languages.launch(this);
        this.launchInhibitors();
        this.launchTasks();
        this.commands.launch(this);

        this.mentionPrefix = null;

        this.development = null;
    }

    get invite() {
        return `https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=2110123254&scope=bot`;
    }

    get owners() {
		const owners = new Set();
		for (const owner of this.options?.owners) {
			const user = this.users.cache.get(owner);
			if (user) owners.add(user);
		}
		return owners;
	}

    async fetchApplication() {
		this.application = await super.fetchApplication();
		return this.application;
	}

    // Read event files and launches events.
    launchEvents() {

        const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            let event = require(`../src/events/${file}`);
            if (Util.isClass(event)) {
                event = new event(this.events, `../src/events/${file}`, `./src/events`);
                this.events.set(event);

                if (event.once) this.once(event.name, (...args) => event.run(...args, this));
                else this.on(event.name, (...args) => event.run(...args, this));
            }
            else console.log(`The event in ${file} can only be an instance of an Event class`);
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