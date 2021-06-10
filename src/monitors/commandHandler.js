const { code } = require('foxxie');
const { prefix: { production, development } } = require('../../config/foxxie');

module.exports = {
    name: 'commandHandler',
    type: 'message',
    async execute (message) {
    
        if (message.author.bot) return;
        let settings = await message.guild.settings?.get();
        let prefixes = [`<@!${message.client.user.id}>`, `<@${message.client.user.id}>`, message.client.development ? 'dev' : 'fox'];

        if (!settings?.prefixes.length) prefixes.push(message.client.development ? development : production);
        if (settings?.prefixes.length) settings.prefixes.forEach(p => prefixes.push(p));
        if (settings?.blockedUsers) if (settings.blockedUsers.includes(message.author.id)) return;

        if (new RegExp(`^<@!?${message.client.user.id}>$`).test(message.content)) {
            prefixes.shift();
            prefixes.shift();
            message.responder.success("PREFIX_REMINDER", prefixes.slice(0, -1).map(p => `${code`${p}`}`).join(", "), prefixes.pop());
        }

        prefixes = [...new Set(prefixes)];
        prefixes.forEach(prefix => {
            if (message.content.startsWith(prefix)) return this._commandExecute(prefix, message);
        });
    },
    
    _commandExecute(pre, message) {

        const args = message.content.slice(pre.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        let command = message.client.commands.get(commandName);
        if (!command) return message.client.emit('commandUnknown', message, commandName)

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