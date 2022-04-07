const { ModerationCommand } = require('#moderation');
const { Permissions: { FLAGS } } = require('discord.js');
const { sendError, sendSuccess } = require('#messages');
const { t, languageKeys } = require('#i18n');

module.exports = class extends ModerationCommand {

    constructor(...args) {
        super({
            name: 'warn',
            aliases: ['w'],
            requiredPermissions: [FLAGS.ADD_REACTIONS],
            permissions: [FLAGS.MANAGE_MESSAGES],
            usage: '<Members:members> [Reason:string] [...]',
            usageDelim: ' '
        }, ...args);

        this.customizeResponse('Members', msg => t(msg, languageKeys.system.messageMembersNone));
    }

    async run(msg, [members, ...reason]) {
        const warnable = await this.getModeratable(msg.member, members, true);
        if (!warnable.length) return sendError(msg, this.t.noPerms, { count: members.length });
        // execution
        await msg.guild.moderation.actions.warn(
            {
                userId: this.getIds(members),
                channelId: msg.channel.id,
                moderatorId: msg.member.id,
                reason: reason.join(' ') ?? null
            },
            this.getDmData(msg)
        );
        return this.deleteMsg(msg);
        // return sendSuccess(msg);
    }

};