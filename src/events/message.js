const commandHandler = require('../ws/commandHandler');

module.exports = {
	name: 'message',
	execute: async(message) => {

        // prevents bot dms
        if (!message.guild) return;

        // Execute monitors
        message.client.monitors.forEach(m => { if (m.type === 'message') m.execute(message) });

        // Prevents bot commands.
        if (message.author.bot) return;
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
        message.client.commands.launch(message); 
        message.client.languages.launch(message);
        commandHandler.execute(message);

        // Checks if member is AFK
        message.client.tasks.get('afkcheck').execute(message);

        // Counters
        // message.author.settings.inc(`servers.${message.guild.id}.messageCount`)
        // message.guild.settings.inc('messageCount');
    }
};