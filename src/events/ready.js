const { mongoDB } = require('../../lib/Database');
const { memberCount, clock } = require('../../lib/util/theCornerStore');
const { Team } = require('discord.js');
let retries = 0;
const { Event, Util } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'ready',
            once: true
        })
    }

    async run() {

        try {
			await this.client.fetchApplication();
		} catch (err) {
			if (++retries === 3) return process.exit();
			console.log(`Unable to fetchApplication at this time, waiting 5 seconds and retrying. Retries left: ${retries - 3}`);
			await Util.sleep(5000);
			return this.run();
		}

        if (!this.client.options.owners.length) {
			if (this.client.application.owner instanceof Team) this.client.options.owners.push(...this.client.application.owner.members.keys());
			else this.client.options.owners.push(this.client.application.owner.id);
		}

        this.client.mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>`);
        this.client.development = this.client.user.id === '825130284382289920' ? true : false;
        mongoDB();

        // Botwide
        this.client.tasks.run(this.client);
        // The Corner Store, memberCount & clock
        // memberCount(client);
        // clock(client);

        const actvs = [
            `with ${this.client.guilds.cache.size.toLocaleString()} servers & ${this.client.users.cache.size.toLocaleString()} users.`,
            `v${this.client.options.version} | fox help`,
            `with ${this.client.commands.size} Commands & ${this.client.aliases.size} Aliases`,
            `v${this.client.options.version} | fox support`,
            `🏳️‍🌈  Happy pride month!`
        ]

        this.client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
        setInterval(() => this.client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]), 30000);

        console.log(`[${this.client.user.username}] Ready! Logged in with ${this.client.commands.size} commands and ${this.client.aliases.size} aliases.`);
    }
}