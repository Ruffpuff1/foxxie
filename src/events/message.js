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
        message.client.monitors.filter(monitor => monitor.type === 'message').forEach(monitor => monitor.execute(message));
        // message.client.monitors.forEach(m => { if (m.type === 'message') m.execute(message) });

        // Checks if member is AFK
        message.client.tasks.get('afkcheck').execute(message);

        // Counters
        // message.author.settings.inc(`servers.${message.guild.id}.messageCount`)
        // message.guild.settings.inc('messageCount');
    }
}