class Schedule {

    constructor(client) {
        this.client = client;
    }

    async create(schedule, value) {
        if (!schedule) return;
        this.client.framework.push(`schedule.${schedule}`, value);
    }

    async fetch(setting) {
        if (!setting) return;
        return this.client.framework.get(`schedule.${setting}`);
    }

    async delete(setting, value) {
        if (!setting) return;
        this.client.framework.pull(`schedule.${setting}`, value);
    }
};

module.exports = Schedule;