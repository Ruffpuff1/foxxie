const mongo = require('../structures/database/mongo');
const _ = require("lodash"); 
const { botSettingsSchema } = require('../structures/database/BotSettingsSchema');

class Reminder {

    constructor(client) {
        this.client = client;
    }

    async fetch(gif) {

        await mongo().then(async () => {
            let gifs = await botSettingsSchema.findById(
                { _id: '812546582531801118' }
            );
            return gif ? this.client.settings = _.get(gifs, gif) : this.client.settings = gifs;
        });
        return this.client.settings;
    }

    async delete(setting, value) {

        if (!setting) return
                await mongo().then(async () => {
                    await botSettingsSchema.findByIdAndUpdate(
                        { _id: '812546582531801118' },
                        { _id: '812546582531801118', $pull: { [setting]: value } },
                        { upsert: true }
                    )
                })
    }
};

module.exports = Reminder;