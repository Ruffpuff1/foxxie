const mongo = require('../structures/database/mongo');
const _ = require("lodash"); 
const { botSettingsSchema } = require('../structures/database/BotSettingsSchema');

class Reminder {

    constructor(client) {
        this.client = client;
    }

    async create(reminder) {

        await mongo().then(async () => {
            await botSettingsSchema.findByIdAndUpdate(
                { _id: '812546582531801118' }, 
                { $push: { reminders: reminder } },
                { upsert: true }
            )
        })
    }

    async fetch() {
        await mongo().then(async () => {
            let gifs = await botSettingsSchema.findById(
                { _id: '812546582531801118' }
            );
            return this.client.settings = gifs.reminders;
        });
        return this.client.settings;
    }

    async delete(value) {
        await mongo().then(async () => {
            await botSettingsSchema.findByIdAndUpdate(
                { _id: '812546582531801118' },
                { _id: '812546582531801118', $pull: { reminders: value } },
                { upsert: true }
            )
        })
    }
};

module.exports = Reminder;