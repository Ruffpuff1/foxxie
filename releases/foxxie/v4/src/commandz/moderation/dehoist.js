const { ModerationCommand } = require('#moderation');
const { Permissions: { FLAGS } } = require('discord.js');
const { Permissions: { isHoisting } } = require('#util');
const { sendError, sendSuccess, sendLoading } = require('#messages');

module.exports = class extends ModerationCommand {

    constructor(...args) {
        super({
            name: 'dehoist',
            aliases: ['dh'],
            usage: '[Member:membername]',
            requiredPermissions: [FLAGS.MANAGE_NICKNAMES],
            permissions: [FLAGS.MANAGE_NICKNAMES]
        }, ...args);
    }

    async run(msg, [member]) {
        if (!member) return this.dehoistAll(msg);
        if (!isHoisting(member)) return sendError(msg, 'COMMAND_DEHOIST_MEMBERNOTHOISTING', member.displayName);
        await msg.guild.moderation.actions.dehoist(
            {
                userId: member.id,
                channelId: msg.channel.id,
                reason: null,
                moderatorId: msg.member.id
            },
            this.getDmData(msg)
        );
        return this.deleteMsg(msg);
        // return sendSuccess(msg, 'COMMAND_DEHOIST_MEMBER', member.displayName);
    }

    async dehoistAll(msg) {
        const loading = await sendLoading(msg, 'COMMAND_DEHOIST_LOADING');
        if (msg.guild.members.cache.size !== msg.guild.memberCount) await msg.guild.members.fetch();
        const hoistingMembers = msg.guild.members.cache.filter(member => member.manageable && isHoisting(member));

        if (!hoistingMembers.size) {
            await sendError(msg, 'COMMAND_DEHOIST_NONE');
            return loading.delete();
        }
        await msg.guild.moderation.actions.dehoist(
            {
                userId: this.getIds(hoistingMembers),
                channelId: msg.channel.id,
                reason: null,
                moderatorId: msg.member.id
            },
            this.getDmData(msg)
        );
        await sendSuccess(msg, 'COMMAND_DEHOIST_ALLSUCCESS', hoistingMembers.size);
        return loading.delete();
    }

};