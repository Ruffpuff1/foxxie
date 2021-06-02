const { owner } = require('../../../config/foxxie');

module.exports = {
    name: 'bugreport',
    aliases: ['bug'],
    usage: 'fox bugreport [bug]',
    category: 'utility',
    async execute (props) {

        let { message, args } = props;

        let msg;
        if (!args.slice(0).join(' ')) msg = await message.responder.error('COMMAND_BUGREPORT_NOBUG');
        if (args.slice(0).join(' ')) return this._response(props, msg, args.slice(0).join(' '))
        if (msg) return message.awaitResponse(props, msg, this._response);
    },

    async _response({ message }, msg, bug) {

        if (msg) msg.delete();
        await owner.forEach(o => message.client.users.cache.get(o).send(`Sent by **${message.author.tag}** (ID: ${message.author.id})\n**Guild**: ${message.guild.name} (ID: ${message.guild.id})\n\`\`\`${bug}\`\`\``).catch(() => null));
        return message.responder.success();
    }
}