const { Structures } = require('discord.js');
const { english } = require('../../src/languages/en-US');
const { moderation, moderationLog } = require('../GuildLogger');
const mongo = require('../structures/database/mongo');
const { serverSchema } = require('../structures/database/ServerSchemas');

Structures.extend('Guild', Guild => {
    class FoxxieGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.guild = data
        }

        settings = {
            get: async (setting) => {
                await mongo().then(async () => {
                    let settings = await serverSchema.findById(
                        { _id: this.guild.id }
                    )
                    return setting ? this.guild.settings = settings[setting] : this.guild.settings = settings
                })
                return this.guild.settings
            },
            
            set: async function(guild, setting, value){
                if (!guild || !setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: guild.id },
                        { _id: guild.id, [setting]: value },
                        { upsert: true }
                    )
                })
            },

            unset: async function(guild, setting){
                if (!guild || !setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: guild.id }, 
                        { _id: guild.id, $unset: { [setting]: '' }}
                    )
                })
            },

            push: async function(guild, setting, value){
                if (!guild || !setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: guild.id }, 
                        { _id: guild.id, $push: { [setting]: value }},
                        { upsert: true }
                    )
                })
            },

            pull: async function(guild, setting, value){
                if (!guild || !setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate(
                        { _id: guild.id },
                        { _id: guild.id, $pull: { [setting]: value }}
                    )
                })
            }
        }

        language = {
            get(key, language, ...params){

                let keys = english

                function dynFunc(name, arrayParams){
                    try { 
                        return keys[name](...arrayParams);
                    } catch (e) {
                        console.log(e);
                        return keys['DEFAULT'](name);
                    }
                }
                return dynFunc(key, [...params])
            } 
        }

        logger = {
            moderation: async function(...args) { moderation(...args) }
        }

    }
    return FoxxieGuild
})