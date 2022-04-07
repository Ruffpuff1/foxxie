const { FoxxieCommand } = require('#structures');
const { Permissions: { FLAGS } } = require('discord.js');
const { events } = require('#utils/Constants');
const { sendSuccess } = require('#messages');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['tb'],
            usage: '[Member:member]',
            requiredPermissions: [FLAGS.ADD_REACTIONS],
            permissions: [FLAGS.ADMINISTRATOR]
        });
    }

    async run(msg, [member = msg.member]) {
        const channelID = msg.guild.settings.get(`boost.channel`);
        if (!channelID) return sendSuccess(msg);
        const channel = msg.guild.channels.cache.get(channelID);
        if (!channel) return sendSuccess(msg);
        await this.client.emit(events.GUILD_BOOST, member, msg.guild, channel);
        return sendSuccess(msg);
    }

};