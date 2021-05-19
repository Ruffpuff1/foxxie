const { Structures } = require('discord.js');
const _ = require("lodash");
const Language = require('../../lib/Language');
const mongo = require('../structures/database/mongo');
const { serverSchema } = require('../structures/database/ServerSchemas');
const GuildLogger = require('../GuildLogger');

Structures.extend('Guild', Guild => {
    class FoxxieGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.guild = data
            this.language = new Language(this);
            this.log = new GuildLogger(this)
        }

        settings = {
            get: async (setting) => {
                await mongo().then(async () => {
                    let settings = await serverSchema.findById(
                        { _id: this.guild.id }
                    )
                    return setting ? this.guild.settings = _.get(settings, setting) : this.guild.settings =  settings
                })
                return this.guild.settings
            },
            
            set: async (setting, value) => {
                if (!setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: this.guild.id },
                        { _id: this.guild.id, [setting]: value },
                        { upsert: true }
                    )
                })
            },

            unset: async (setting) => {
                if (!setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: this.guild.id }, 
                        { _id: this.guild.id, $unset: { [setting]: '' }}
                    )
                })
            },

            push: async (setting, value) => {
                if (!setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: this.guild.id }, 
                        { _id: this.guild.id, $push: { [setting]: value }},
                        { upsert: true }
                    )
                })
            },

            pull: async (setting, value) => {
                if (!setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: this.guild.id },
                        { _id: this.guild.id, $pull: { [setting]: value }}
                    )
                })
            },

            inc: async (setting, total) => {
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: this.guild.id },
                        { $inc: { [setting]: total? total : 1 } },
                        { upsert: true }
                    ).exec()
                })
            }
        }
    }
    return FoxxieGuild
})