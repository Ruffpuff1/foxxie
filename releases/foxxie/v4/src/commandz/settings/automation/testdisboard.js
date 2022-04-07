const { FoxxieCommand } = require('#structures');
const { Permissions: { FLAGS } } = require('discord.js');
const { sendSuccess } = require('#messages');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['td', 'testbump'],
            requiredPermissions: [FLAGS.ADD_REACTIONS],
            permissions: [FLAGS.ADMINISTRATOR]
        });
    }

    async run(msg) {
        await this.client.tasks.get('disboard').message(msg.guild);
        return sendSuccess(msg);
    }

};