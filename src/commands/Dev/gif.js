const { owner } = require("../../../config/foxxie");

module.exports = {
    name: 'gif',
    category: 'developer',
    usage: 'fox gif [add|list] [roleplay] [name] (gif)',
    execute: async (props) => {

        let { message, args, language, lang } = props;
        if (!owner.includes(message.author.id)) return;
        if (/(add|new)/i.test(args[0])) return _add();
        if (/(list|show)/i.test(args[0])) return _list();
        return language.send('COMMAND_GIF_INVALIDUSE', lang);

        async function _add() {

            if (!/(roleplay)/.test(args[1])) return language.send('COMMAND_GIF_INVALIDLABEL', lang);
            await message.bot.push(`gifs.${args[1]}.${args[2]}`, args[3].replace('<', "").replace('>', ""));
            
            return language.send('COMMAND_GIF_ADDED_SUCCESS', lang, args[2], args[3]);
        }
        async function _list() {

            if (!/(roleplay)/.test(args[1])) return language.send('COMMAND_GIF_INVALIDLABEL', lang);

            let ls = await message.bot.get(`gifs.${args[1]}.${args[2]}`);
            if (!ls) return language.send('COMMAND_GIF_NOLIST', lang);

            return message.channel.send(`\`\`\`js\n${ls.map(l => `"${l}"`).join('\n')}\n\`\`\``);
        }
    }
}