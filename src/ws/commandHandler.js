const { bold } = require('foxxie');
const { prefix: { production, development } } = require('../../config/foxxie');

module.exports = {
    name: 'commandHandler',
    async execute (message) {
    
        if (message.author.bot) return;

        let settings = await message.guild.settings?.get()
        let language = message.language;

        let prefixes = [`<@!${message.client.user.id}>`, `<@${message.client.user.id}>`];
        message.client.user.id === '825130284382289920' ? prefixes.push('dev') : prefixes.push('fox');
        
        if (!settings?.prefixes.length) 
        prefixes.push(message.client.user.id === '825130284382289920' ? development : production);
        if (settings?.prefixes.length) settings?.prefixes.forEach(p => prefixes.push(p));

        if (settings?.blockedUsers != null) if (settings.blockedUsers.includes(message.author.id)) return;

        if (message.content === `<@!${message.client.user.id}>` || message.content === `<@${message.client.user.id}>`) {
            prefixes.shift();
            prefixes.shift();
            message.responder.success("PREFIX_REMINDER", prefixes.slice(0, -1).map(p => `${bold`${p}`}`).join(", "), prefixes.pop());
        }

        let uprefixes = [...new Set(prefixes)];
    
        uprefixes.forEach(pfx => {
            if (message.content.toLowerCase().startsWith(pfx.toLowerCase())) {
                return this._commandExecute(pfx, message);
            }
        });
    },
    
    async _commandExecute(pre, message) {

        const args = message.content.slice(pre.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        let command = message.client.commands.get(commandName);
        if (!command) return;

        try {
            message.client.inhibitors.get('permissions').execute(command, message);
        } catch (e) {
            if (e == true) return null;
            return message.responder.error(e, command.permissions?.toLowerCase()?.replace(/_/g, ' '));
        }
        try {
            command.run(message, args);
        }
        catch (e) {
            message.responder.error('ERROR_GENERIC', e);
            return null;
        }
    }
}