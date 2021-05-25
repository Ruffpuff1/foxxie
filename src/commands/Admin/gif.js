module.exports = {
    name: 'gif',
    usage: 'fox gif [add|list] [roleplay] [name] (gif)',
    category: 'admin',
    permissionLevel: 9,
    async execute (props) {

        let { args, language, lang } = props;
        if (/(add|new)/i.test(args[0])) return this._add(props);
        if (/(list|show)/i.test(args[0])) return this._list(prop);
        return language.send('COMMAND_GIF_INVALIDUSE', lang);
    },

    async _add({ message, args, language, lang }) {

        if (!/(roleplay)/.test(args[1])) return language.send('COMMAND_GIF_INVALIDLABEL', lang);
        await message.bot.push(`gifs.${args[1]}.${args[2]}`, args[3].replace('<', "").replace('>', ""));
        
        return language.send('COMMAND_GIF_ADDED_SUCCESS', lang, args[2], args[3]);
    },

    async _list( { message, args, language, lang } ) {

        if (!/(roleplay)/.test(args[1])) return language.send('COMMAND_GIF_INVALIDLABEL', lang);

        let ls = await message.bot.get(`gifs.${args[1]}.${args[2]}`);
        if (!ls) return language.send('COMMAND_GIF_NOLIST', lang);

        return message.channel.send(`\`\`\`js\n${ls.map(l => `"${l}"`).join('\n')}\n\`\`\``);
    }
}