const { mongoDB } = require('~/lib/Database');
const { Team } = require('discord.js');
let retries = 0;
const { Event, util } = require('@foxxie/tails');

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
			console.log(`[${this.client.user.username}] Unable to fetchApplication at this time, waiting 5 seconds and retrying. Retries left: ${retries - 3}`);
			await util.sleep(5000);
			return this.run();
		}

        if (!this.client.options.owners.length) {
			if (this.client.application.owner instanceof Team) this.client.options.owners.push(...this.client.application.owner.members.keys());
			else this.client.options.owners.push(this.client.application.owner.id);
		}
        mongoDB();
        this.status()

        this.client.schedule.init();
        this.client.events.get('theCornerStore').clock();
        this.client.ready = true;
        
        console.log(this.client.options.readyMessage(this.client));
    }

    status() {

        const status = this.client.options.status(this.client);
        if (this.client.options.enableStatus) this.client.user.setActivity(status[Math.floor(Math.random() * (status.length - 1) + 1)]);

        setInterval(() => {
            if (!this.client.options.enableStatus) return null;
            else this.client.user.setActivity(status[Math.floor(Math.random() * (status.length - 1) + 1)]);
        }, 25000)
    }
}