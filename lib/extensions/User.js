const { Structures } = require('discord.js');
const mongo = require('../structures/database/mongo');
const _ = require("lodash"); 
const { userSchema } = require('../structures/database/UserSchema');

Structures.extend('User', User => {
    class FoxxieUser extends User {
        constructor(client, data){
            super(client, data)
            this.user = data
        }

        settings = {
            get: async (setting) => {
                await mongo().then(async () => {
                    let settings = await userSchema.findById(
                        { _id: this.user.id }
                    );
                    return setting ? this.user.settings = _.get(settings, setting) : this.user.settings =  settings
                });
                return this.user.settings
            },
            
            inc: async (setting, total) => {
                await mongo().then(async () => {
                    await userSchema.findByIdAndUpdate(
                        { _id: this.user.id },
                        { $inc: { [setting]: total? total : 1 } },
                        { upsert: true }
                    ).exec()
                })
            }
        }
    }
    return FoxxieUser
})