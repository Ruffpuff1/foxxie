const { prefix: { production, development } } = require('../../config/foxxie')
module.exports.commandHandler = async (message) => {
    
    if (message.author.bot) return;

    let settings = await message.guild.settings?.get()
    let language = message.guild.language
    let prefixes = ['fox'];
    
    if (!settings?.prefixes.length) prefixes.push(message.client.user.id === '825130284382289920' ? development : production);
    if (settings?.prefixes.length) settings?.prefixes.forEach(p => prefixes.push(p));
    if (settings?.blockedUsers != null) if (settings.blockedUsers.includes(message.author.id)) return;

    let lang = 'en-US';
    let mentionPrefix = `<@!${message.client.user.id}>`

    if (message.content === mentionPrefix) message.channel.send(language.get("PREFIX_REMINDER", lang, prefixes.slice(0, -1).map(p => `\`${p}\``).join(", "), prefixes.pop()))
    
    prefixes.forEach(pfx => {
        if (message.content.toLowerCase().startsWith(pfx.toLowerCase())) return _commandExecute(pfx);
    })

    async function _commandExecute(pre) {
        const args = message.content.slice(pre.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) return message.responder.error('RESPONDER_ERROR_PERMS_AUTHOR', lang, command);
        };

        try {
            let props = { lang, message, args, settings, language };
            command.execute(props); 
        } catch (e) {
            console.error(e);
            return message.responder.error('RESPONDER_ERROR_CODE', lang)
        }
    }
}