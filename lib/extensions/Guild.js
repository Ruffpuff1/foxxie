const { Structures } = require('discord.js');
const { english } = require('../../src/languages/en-US')
const mongo = require('../structures/database/mongo');
const { serverSchema } = require('../structures/database/ServerSchemas');

Structures.extend('Guild', Guild => {
    class FoxxieGuild extends Guild {
        constructor(client, data) {
            super(client, data);
        }

        language = {
            get(key, language, ...params){

                let keys = english;
                if (language === 'en-US') keys = english;
                if (language === 'es-MX') return dynFunc('DEFAULT', ['es-MX'])//keys = spanish;

                function dynFunc(name, arrayParams){
                    try { 
                        return keys[name](...arrayParams) 
                    } catch (e) {
                        return keys['DEFAULT'](name)
                    }
                }
                return dynFunc(key, [...params])
            } 
        }

        settings = {
            get: async function(guild){
                if (!guild) return null
                await mongo().then(async () => {
                    this.settings = await serverSchema.findById({
                        _id: guild.id
                    })
                    return this.settings
                })
                return this.settings
            },
            set: async function(guild, setting, value){
                if (!guild || !setting) return
                await mongo().then(async () => {
                    await serverSchema.findByIdAndUpdate({
                        _id: guild.id
                    }, {
                        _id: guild.id,
                        [setting]: value
                    }, {
                        upsert: true
                    })
                })
            }
        }
    }
    return FoxxieGuild
})