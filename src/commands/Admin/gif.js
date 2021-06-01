module.exports = {
    name: 'gif',
    usage: 'fox gif [add|list] [roleplay] [name] (gif)',
    category: 'admin',
    permissionLevel: 9,
    async execute (props) {

        let { args, message } = props;
        if (/(add|new)/i.test(args[0])) return this._add(props);
        if (/(list|show)/i.test(args[0])) return this._list(props);
        return message.responder.error('COMMAND_GIF_INVALIDUSE');
    },

    async _add({ message, args }) {

        if (!/(roleplay)/.test(args[1])) return message.responder.error('COMMAND_GIF_INVALIDLABEL');
        await message.client.framework.push(`gifs.${args[1]}.${args[2]}`, args[3].replace('<', "").replace('>', ""));
        
        return message.responder.success('COMMAND_GIF_ADDED_SUCCESS', args[2], args[3]);
    },

    async _list( { message, args } ) {

        if (!/(roleplay)/.test(args[1])) return message.responder.error('COMMAND_GIF_INVALIDLABEL');

        let ls = await message.client.framework.get(`gifs.${args[1]}.${args[2]}`);
        if (!ls) return message.responder.error('COMMAND_GIF_NOLIST');

        return message.channel.send(`\`\`\`js\n${ls.map(l => `"${l}"`).join('\n')}\n\`\`\``);
    }
}