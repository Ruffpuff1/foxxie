const mongo = require('../structures/database/mongo');
const _ = require("lodash"); 
const { foxxieSchema } = require('../structures/database/FoxxieSchema');


class FoxxieSettings {

    constructor(client){
        this.client = client;
    }

    async get (setting) {
        await mongo().then(async () => {
            let settings = await foxxieSchema.findById(
                { _id: '812546582531801118' }
            );
            return setting ? this.settings = _.get(settings, setting) : this.settings = settings;
        });
        return this.settings;
    }

    async push (setting, value) {
        if (!setting) return;
        await mongo().then(async () => {
            await foxxieSchema.findByIdAndUpdate(
                { _id: '812546582531801118' },
                { _id: '812546582531801118', $push: { [setting]: value } },
                { upsert: true }
            )
        })
    }

    async pull (setting, value) {
        if (!setting) return;
        await mongo().then(async () => {
            await foxxieSchema.findByIdAndUpdate(
                { _id: '812546582531801118' },
                { _id: '812546582531801118', $pull: { [setting]: value } },
                { upsert: true }
            )
        })
    }
}

module.exports = FoxxieSettings;