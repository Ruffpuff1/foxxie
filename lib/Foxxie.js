const { Client, Collection, Permissions, Permissions: { FLAGS } } = require('discord.js');
const fs = require('fs');
const Schedule = require('~/lib/Schedule');
const {
    EventStore,
    MonitorStore,
    Util,
    TaskStore,
    InhibitorStore,
    getRootDirectory
} = require('foxxie');
const FoxxieSettings = require('./extensions/Client');
const CommandStore = require('./CommandStore'), LanguageStore = require('./LanguageStore');

class Foxxie extends Client {
    constructor(options) {


        super(options);

        this.userBaseDirectory = getRootDirectory();

        this.aliases = new Collection();
        /**
		 * The cache where commands are stored
		 * @since 3.0
		 * @type {CommandStore}
		 */
        this.commands = new CommandStore(this);

        this.inhibitors = new InhibitorStore(this);

        this.monitors = new MonitorStore(this);
        /**
		 * The cache where languages are stored
		 * @since 3.0
		 * @type {LanguageStore}
		 */
        this.languages = new LanguageStore(this);

        this.events = new EventStore(this);

        this.tasks = new TaskStore(this);

        this.pieceStores = new Collection();

        this.settings = new FoxxieSettings(this);

        this.schedule = new Schedule(this);

        this.registerStore(this.commands)
            .registerStore(this.inhibitors)
            .registerStore(this.monitors)
            .registerStore(this.languages)
            .registerStore(this.events)
            .registerStore(this.tasks)

        this.launchEvents();
        this.launchMonitors();
        this.languages.launch(this);
        this.launchInhibitors();
        this.launchTasks();
        this.commands.launch(this);

        this.addBans();
        this.addContributors();

        this.ready = false;
    }

    async addBans() {
        const ids = await this.settings.get('globalBans');
        ids?.forEach(async id => {
            const user = await this.users.fetch(id).catch(() => null);
            if (user) this.options.bans.add(user);
        })
    }

    async addContributors() {
        const ids = await this.settings.get('contributors');
        ids?.forEach(async id => {
            const user = await this.users.fetch(id).catch(() => null);
            if (user) this.options.contributors.add(user);
        })
    }

    get mentionPrefix() {
        return new RegExp(`^<@!?${this.application.id}>`);
    }

    get development() {
        return this.application.id === '825130284382289920' ? true : false;
    }

    get contributors() {
        return this.options.contributors;
    }

    get globalBans() {
        return this.options.bans;
    }

    get invite() {
        return `https://discord.com/api/oauth2/authorize?client_id=${this.application.id}&permissions=2110123254&scope=bot`;
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

    registerStore(store) {
		this.pieceStores.set(store.name, store);
		return this;
	}

    // Read event files and launches events.
    launchEvents() {

        const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            let event = require(`../src/events/${file}`);
            if (Util.isClass(event)) {
                event = new event(this.events, `../src/events/${file}`, `./src/events`);
                this.setEvent(event);
            }
            else console.log(`[Foxxie-Util] The event in ${file} can only be an instance of an Event class.`);
        }
    }

    setEvent(event) {
        this.events.set(event);
        if (event.once) this.once(event.name, (...args) => event.run(...args, this));
        else this.on(event.name, (...args) => event.run(...args, this));
    }

    // Read monitor files and launches monitors.
    launchMonitors() {
        const monitorFiles = fs.readdirSync(`./src/monitors`).filter(file => file.endsWith('.js'));
        for (const file of monitorFiles) {
            let monitor = require(`../src/monitors/${file}`);
            if (Util.isClass(monitor)) {
                monitor = new monitor(this.monitors, `../src/monitors/${file}`, `./src/events`);
                this.monitors.set(monitor, )
            }
            else console.log(`[Foxxie-Util] The monitor in ${file} can only be an instance of a Monitor class.`);
        }
    }

    launchInhibitors() {
        const inFiles = fs.readdirSync('./src/inhibitors').filter(file => file.endsWith('.js'));
        for (const file of inFiles) {
            let inhibitor = require(`../src/inhibitors/${file}`);
            if (Util.isClass(inhibitor)) {
                inhibitor = new inhibitor(this.inhibitors, `../src/inhibitors/${file}`, `./src/inhibitors`);
                this.inhibitors.set(inhibitor)
            }
            else console.log(`[Foxxie-Util] The inhibitor in ${file} can only be an instance of an Inhibitor class.`)
        };
    }

    launchTasks() {
        const tasks = fs.readdirSync('./src/tasks').filter(file => file.endsWith('.js'));
        for (const file of tasks) {
            let task = require(`../src/tasks/${file}`);
            if (Util.isClass(task)) {
                task = new task(this.tasks, `../src/tasks/${file}`, `./src/tasks`);
                this.tasks.set(task);
            }
            else console.log(`[Foxxie-Util] The task in ${file} can only be an instance of a Task class.`)
        };
    }
}

module.exports = Foxxie;