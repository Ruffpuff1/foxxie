const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'bugreport',
            aliases: ['bug'],
            description: language => language.get('COMMAND_BUGREPORT_DESCRIPTION'),
            requiredPermissions: ['ADD_REACTIONS'],
            usage: '[...Bug]',
            category: 'utility'
        }) 
    }

    async run(message, args) {

        let msg;
        if (!args.slice(0).join(' ')) msg = await message.responder.error('COMMAND_BUGREPORT_NOBUG');
        if (args.slice(0).join(' ')) return this._response(message, msg, args.slice(0).join(' '))
        if (msg) return message.awaitResponse(message, msg, this._response);
    }

    async _response(message, msg, bug) {

        if (msg) msg.delete();
        await this.client.owners.forEach(o => o.send(`Sent by **${message.author.tag}** (ID: ${message.author.id})\n**Guild**: ${message.guild.name} (ID: ${message.guild.id})\n\`\`\`${bug}\`\`\``).catch(() => null));
        return message.responder.success();
    }
}