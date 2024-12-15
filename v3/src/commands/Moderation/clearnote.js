const Command = require('~/lib/structures/ModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'clearnote',
            aliases: ['un', 'ncl'],
            description: language => language.get('COMMAND_CLEARNOTE_DESCRIPTION'),
            requiredPermissions: ['ADD_REACTIONS'],
            usage: '[Member] [Note | all] (...Reason)',
            category: 'moderation'
        })

        this.permissions = 'BAN_MEMBERS'
    }

    async run(msg, [_, id, ...reason]) {
        const member = msg.members.shift();
        if (!member) return msg.responder.error('MESSAGE_MEMBERS_NONE');

        const clearable = await this.comparePermissions(msg.member, member);
        if (!clearable) return msg.responder.error('COMMAND_CLEARNOTE_NOPERMS');

        reason = reason.join(' ') || msg.language.get('LOG_MODERATION_NOREASON');
        if (/all/i.test(id)) return this.clear(msg, member);

        const note = await member.user.settings.get(`servers.${msg.guild.id}.notes[${id - 1}]`);
        if (!note) return msg.responder.error('COMMAND_CLEARNOTE_NOEXIST');

        await member.user.settings.pull(`servers.${msg.guild.id}.notes`, note);
        return msg.responder.success();
    }

    async clear(msg, member) {
        const loading = await msg.responder.loading();
        const notes = await member.user.settings.get(`servers.${msg.guild.id}.notes`);
        if (!notes?.length) {
            msg.responder.error('COMMAND_CLEARNOTE_NONE');
            return loading.delete();
        };

        const confirmed = async () => {
            member.user.settings.unset(`servers.${msg.guild.id}.notes`);
            msg.responder.success();
            return loading.delete();
        };
        return loading.confirm(loading, 'COMMAND_CLEARNOTE_CONFIRM', msg, confirmed);
    }
}