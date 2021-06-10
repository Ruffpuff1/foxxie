const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'message',
        })
    }

    async run(message) {

        // prevents bot dms
        if (!message.guild) return;

        // Execute monitors
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
        this.client.monitors.run(message);

        // Checks if member is AFK
        message.client.tasks.get('afkcheck').execute(message);

        // Counters
        // message.author.settings.inc(`servers.${message.guild.id}.messageCount`)
        // message.guild.settings.inc('messageCount');
    }
}