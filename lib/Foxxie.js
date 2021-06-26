const Client = require('@foxxie/tails').Client;
const Schedule = require('~/lib/Schedule');
const FoxxieSettings = require('./extensions/Client');

class FoxxieClient extends Client {
    constructor(options) {
        super(options);

        this.settings = new FoxxieSettings(this);
        this.schedule = new Schedule(this);

        this.addBans();
        this.addContributors();
    }

    get mentionPrefix() {
        return new RegExp(`^<@!?${this.application.id}>`);
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

    get development() {
        return this.user.id === '825130284382289920' ? true : false;
    }

    get contributors() {
        return this.options.contributors;
    }

    get globalBans() {
        return this.options.bans;
    }
}

module.exports = FoxxieClient;