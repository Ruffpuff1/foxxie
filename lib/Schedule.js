class Schedule {

    constructor(client) {
        this.client = client;
    }

    async create(schedule, value) {
        if (!schedule) return;
        this.client.settings.push(`schedule.${schedule}`, value);
    }

    async fetch(setting) {
        if (!setting) return;
        return this.client.settings.get(`schedule.${setting}`);
    }

    async delete(setting, value) {
        if (!setting) return;
        this.client.settings.pull(`schedule.${setting}`, value);
    }
};

module.exports = Schedule;