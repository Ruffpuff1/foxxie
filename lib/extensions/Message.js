const { Structures } = require('discord.js');
const Responder = require('../../lib/Responder')
const Language = require('../../lib/Language');
const mongo = require('../structures/database/mongo');
const { reactions: { yes, no } } = require('../util/constants')
const _ = require("lodash"); 
const { botSettingsSchema } = require('../structures/database/BotSettingsSchema');

Structures.extend('Message', Message => {
    class FoxxieMessage extends Message {
        constructor(client, data, channel){
            super(client, data, channel)
            this.responder = new Responder(this);
            this.language = new Language(this);
            this.channel = channel;
            this.client.settings = null;
            this.message = this;
        }

        async confirm(message, key, lang, msg, confirmed) {

            await message.edit(this.language.get(key, lang));
            await message.react(yes);
            await message.react(no);

            let collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id);

            let t = await collector.on('collect', async (reaction, user) => {

                if (reaction._emoji.id === no) {

                    message.delete();
                    return this.language.send('MESSAGE_CANCELLED', lang);
                }
                if (reaction._emoji.id === yes) return confirmed();
            });
        }

        bot = {

            get: async (gif) => {
                await mongo().then(async () => {
                    let gifs = await botSettingsSchema.findById(
                        { _id: '812546582531801118' }
                    );
                    return gif ? this.client.settings = _.get(gifs, gif) : this.client.settings = gifs;
                });
                return this.client.settings;
            },

            push: async (setting, value) => {
                if (!setting) return
                await mongo().then(async () => {
                    await botSettingsSchema.findByIdAndUpdate(
                        { _id: '812546582531801118' },
                        { _id: '812546582531801118', $push: { [setting]: value } },
                        { upsert: true }
                    )
                })
            },

            pull: async (setting, value) => {
                if (!setting) return
                await mongo().then(async () => {
                    await botSettingsSchema.findByIdAndUpdate(
                        { _id: '812546582531801118' },
                        { _id: '812546582531801118', $pull: { [setting]: value } },
                        { upsert: true }
                    )
                })
            }

        }
    }
    return FoxxieMessage
})