const { prefix: { production, development } } = require('../../config/foxxie');

module.exports = {
    name: 'commandHandler',
    async execute (message) {
    
        if (message.author.bot) return;

        let settings = await message.guild.settings?.get()
        let language = message.language
        let prefixes = [];
        message.client.user.id === '825130284382289920' ? prefixes.push('dev') : prefixes.push('fox');
        if (!settings?.prefixes.length) prefixes.push(message.client.user.id === '825130284382289920' ? development : production);
        if (settings?.prefixes.length) settings?.prefixes.forEach(p => prefixes.push(p));
        if (settings?.blockedUsers != null) if (settings.blockedUsers.includes(message.author.id)) return;

        let lang = settings?.language;
        if (!lang) lang = 'en-US';
        let mentionPrefix = `<@!${message.client.user.id}>`

        if (message.content === mentionPrefix) message.language.send("PREFIX_REMINDER", lang, prefixes.slice(0, -1).map(p => `\`${p}\``).join(", "), prefixes.pop());

        let uprefixes = [...new Set(prefixes)];
    
        uprefixes.forEach(pfx => {
            if (message.content.toLowerCase().startsWith(pfx.toLowerCase())) return this._commandExecute(pfx, message, lang, language);
        });
    },
    
    async _commandExecute(pre, message, lang, language) {

        const args = message.content.slice(pre.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        // Permissions check,
        try { 
            await message.client.inhibitors.get('permissions').execute({command, message});
        } catch (e) { 
            if (e === true) return;
            return language.send(e, lang, command.permissions)
        };
        
        // Command Execute.
        try {
            let props = { lang, message, args, language };
            command.execute(props); 
        } catch (e) {
            console.error(e);
            return message.responder.error('RESPONDER_ERROR_CODE', lang)
        }
    }
}