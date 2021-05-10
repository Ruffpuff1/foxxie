const { Structures } = require('discord.js');
const mongo = require('../structures/database/mongo');
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
                    return setting ? this.user.settings = settings[setting] : this.user.settings = settings;
                });
                return this.user.settings
            }
        }
    }
    return FoxxieUser
})