const { FoxxieCommand } = require('#structures');
const { User } = require('discord.js');
const { sendSuccess } = require('#messages');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            permissionLevel: 10,
            usage: '<Users:user|Guilds:guild|ServerIDs:str> [...]',
            usageDelim: ' ',
            aliases: ['bl', 'wl', 'whitelist'],
            guarded: true
        });
    }

    async run(message, usersAndGuilds) {
        for (const userOrGuild of new Set(usersAndGuilds)) {
            const type = userOrGuild instanceof User ? 'Users' : 'Guilds';
            if (this.client.settings.get(`blocked${type}`).includes(userOrGuild.id || userOrGuild)) {
                await this.client.settings.pull(`blocked${type}`, userOrGuild.id || userOrGuild);
            } else {
                await this.client.settings.push(`blocked${type}`, userOrGuild.id || userOrGuild);
            }
        }
        return sendSuccess(message, this.t.success, { list: usersAndGuilds.map(entry => `**${entry.name || entry.username || entry}**`) });
    }

};