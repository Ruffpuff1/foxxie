const { FoxxieCommand } = require('#structures');
const { Permissions: { FLAGS } } = require('discord.js');
const { sendSuccess } = require('#messages');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['tl'],
            usage: '[Member:member]',
            requiredPermissions: [FLAGS.ADD_REACTIONS],
            permissions: [FLAGS.ADMINISTRATOR]
        });
    }

    async run(msg, [member = msg.member]) {
        await this.client.emit('guildMemberRemove', member);
        return sendSuccess(msg);
    }

};