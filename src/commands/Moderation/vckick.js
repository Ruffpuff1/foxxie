const Command = require('../../../lib/structures/MultiModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'vckick',
            aliases: ['vck', 'disconnect'],
            description: language => language.get('COMMAND_VCKICK_DESCRIPTION'),
            usage: '[Members] (reason)',
            permissions: 'MOVE_MEMBERS',
            category: 'moderation'
        })
    }

    async run(msg, args) {

        const members = msg.members;
        if (!members) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        let kickable = await this.getModeratable(msg.member, members, true);

        if (!kickable.length) return msg.responder.error('COMMAND_VCKICK_NOPERMS', members.length > 1);
        kickable = kickable.filter(m => m.voice.channelID);
        if (!kickable.length) return msg.responder.error('COMMAND_VCKICK_NOVOICE', members.length > 1);

        let reason = args.slice(members.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');
        await this.executeKicks(msg, reason, kickable);
        this.logActions(msg.guild, muteable.map(m => m.user), { type: 'mod', action: 'vckick', reason, channel: msg.channel, dm: true, moderator: msg.member });
        return msg.responder.success();
    }

    executeKicks(msg, reason, members) {
        for (const member of members) {
            member.voice.setChannel(null, `${msg.author.tag} | ${reason}`).catch(() => null);
        }
    }
}