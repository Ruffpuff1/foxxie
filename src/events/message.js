const { commandHandler } = require('../handlers/commandHandler');
const { afkCheck } = require('../tasks/afkcheck');

module.exports = {
	name: 'message',
	execute: async(message) => {

        // prevents bot dms
        if (!message.guild) return
        if (message.author.bot) return;
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return
        
        for (let monitor of ['anti-invite', 'disboardbump', 'regextags']){
            let moni = message.client.monitors.get(monitor)
            if (moni) moni.execute(message)
        }
        // Botwide
        commandHandler(message)
        afkCheck(message)
        // Counters
        message.author.settings.inc(`servers.${message.guild.id}.messageCount`)
        message.guild.settings.inc('messageCount');
    }
};