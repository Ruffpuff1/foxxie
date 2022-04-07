const { ModerationCommand } = require('#moderation');
const { Permissions: { FLAGS } } = require('discord.js');
const { sendError, sendSuccess } = require('#messages');

module.exports = class extends ModerationCommand {

    constructor(...args) {
        super({
            name: 'clearwarn',
            permissions: FLAGS.BAN_MEMBERS,
            requiredPermissions: FLAGS.ADD_REACTIONS,
            aliases: ['uw', 'pardon', 'warnremove'],
            usage: '<Member:member> <Ids:string> [Reason:string] [...]',
            usageDelim: ' '
        }, ...args);
    }

    async run(msg, [member, id, ...reason]) {
        const warnable = this.comparePermissions(msg.member, member);
        if (!warnable) return sendError(msg, 'COMMAND_CLEARWARN_NOPERMS', `**${member.user.tag}**`);
        reason = reason.join(' ') ?? null;

        const warnings = this.getWarns(member, id);
        if (!warnings.length) return sendError(msg, 'COMMAND_CLEARWARN_NOWARNS', `**${member.user.tag}**`);
        await member.settings.sync();

        await msg.guild.moderation.actions.unwarn(
            {
                userId: member.id,
                moderatorId: msg.member.id,
                channelId: msg.channel.id,
                reason
            },
            this.getDmData(msg)
        );
        return this.deleteMsg(msg);
        // return sendSuccess(msg);
    }

    getWarns(member, ids) {
        const warnings = member.settings.get('warnings');
        if (!warnings.length) return [];
        const range = /^(?<start>\d)-(?<end>\d)$/;
        const multiple = /^(\d,)+\d$/;
        if (ids === 'all') {
            warnings.forEach(warn => member.settings.pull(`warnings`, warn));
            return warnings;
        }
        if (range.test(ids)) {
            const { start, end } = range.exec(ids).groups;
            const updated = warnings.splice(start - 1, end - start + 1);
            updated.forEach(warn => member.settings.pull(`warnings`, warn));
            return updated;
        }
        if (multiple.test(ids)) {
            ids = ids.split(',').map(id => parseInt(id));
            const pulled = [];
            warnings.forEach((warn, idx) => {
                if (ids.includes(idx + 1)) {
                    member.settings.pull(`warnings`, warn);
                    pulled.push(warn);
                }
            });
            return pulled;
        }
        if (!Number.isNaN(parseInt(ids)) && warnings[ids - 1]) {
            member.settings.pull(`warnings`, warnings[ids - 1]);
            return [warnings[ids - 1]];
        }
        throw 'Invalid id or ids';
    }

};