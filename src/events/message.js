const { commandHandler } = require('../handlers/commandHandler');
const { afkCheck } = require('../tasks/afkcheck');

module.exports = {
	name: 'message',
	execute: async(message) => {

        // prevents bot dms
        if (!message.guild) return
        if (message.author.bot) return;
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return
        // Execute Monitors
        message.client.monitors.forEach(m => { if (m.type === 'message') m.execute(message) });
        // Botwide
        commandHandler(message)
        afkCheck(message)
        // Counters
        // message.author.settings.inc(`servers.${message.guild.id}.messageCount`)
        // message.guild.settings.inc('messageCount');
    }
};