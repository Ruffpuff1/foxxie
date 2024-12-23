const Command = require('~/lib/structures/ModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'clearwarn',
            aliases: ['clearwarns', 'cw', 'pardon'],
            description: language => language.get('COMMAND_CLEARWARN_DESCRIPTION'),
            requiredPermissions: ['ADD_REACTIONS'],
            usage: '[Member] [Warn | all] (...Reason)',
            category: 'moderation'
        })

        this.permissions = 'BAN_MEMBERS';
    }

    async run(msg, [_, id, ...reason]) {
        const member = msg.members.shift();
        if (!member) return msg.responder.error('MESSAGE_MEMBERS_NONE');

        const warnable = await this.comparePermissions(msg.member, member);
        if (!warnable) return msg.responder.error('COMMAND_CLEARWARN_NOPERMS');

        reason = reason.join(' ') || msg.language.get('LOG_MODERATION_NOREASON');
        if (/all/i.test(id)) return this.clear(msg, member, reason);

        const warn = await member.user.settings.get(`servers.${msg.guild.id}.warnings[${id - 1}]`);
        if (!warn) return msg.responder.error('COMMAND_CLEARWARN_NOEXIST');

        await member.user.settings.pull(`servers.${msg.guild.id}.warnings`, warn);
        await this.logActions(msg.guild, [member], { type: 'mod', action: 'clearwarn', moderator: msg.member, reason, channel: msg.channel, dm: true, warn });
        return msg.responder.success();
    }

    async clear(msg, member, reason) {
        const loading = await msg.responder.loading();
        const warns = await member.user.settings.get(`servers.${msg.guild.id}.warnings`);
        if (!warns?.length) {
            msg.responder.error('COMMAND_CLEARWARN_NONE');
            return loading.delete();
        };

        const confirmed = async () => {
            member.user.settings.unset(`servers.${msg.guild.id}.warnings`);
            await this.logActions(msg.guild, [member], { type: 'mod', action: 'clearwarns', moderator: msg.member, reason, channel: msg.channel, dm: true, warns });
            msg.responder.success();
            return loading.delete();
        };
        return loading.confirm(loading, 'COMMAND_CLEARWARN_CONFIRM', msg, confirmed);
    }
}