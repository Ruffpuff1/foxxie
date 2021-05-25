const mongo = require('./structures/database/mongo');
const _ = require("lodash"); 
const { foxxieSchema } = require('./structures/database/FoxxieSchema');

class Schedule {

    constructor(client) {
        this.client = client;
    }

    async create(schedule, value) {
        if (!schedule) return
        await mongo().then(async () => {
            await foxxieSchema.findByIdAndUpdate(
                { _id: '812546582531801118' }, 
                { $push: { [`schedule.${schedule}`]: value } },
                { upsert: true }
            )
        })
    }

    async fetch(setting) {
        if (!setting) return;
        await mongo().then(async () => {
            let gifs = await foxxieSchema.findById(
                { _id: '812546582531801118' }
            );
            return this.client.settings = _.get(gifs, `schedule.${setting}`);
        });
        return this.client.settings;
    }

    async delete(setting, value) {
        if (!setting) return;
        await mongo().then(async () => {
            await foxxieSchema.findByIdAndUpdate(
                { _id: '812546582531801118' },
                { _id: '812546582531801118', $pull: { [`schedule.${setting}`]: value } },
                { upsert: true }
            )
        })
    }
};

module.exports = Schedule;