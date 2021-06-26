const { Event } = require('@foxxie/tails');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'guildCreate'
        })
    }

    async run(guild) {
        const blacklisted = await this.client.settings.get('blockedGuilds');
        if (blacklisted.includes(guild.id)) {
            guild.leave();
            return this.client.emit('wtf', `[${this.client.user.username}] Blacklisted guild detected: ${guild.name} (ID: ${guild.id})`);
        };
        guild.createMuteRole();
    }
}