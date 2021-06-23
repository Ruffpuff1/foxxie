const Command = require('../../../lib/structures/MultiModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'kick',
            aliases: ['k', 'boot', '409'],
            description: language => language.get('COMMAND_KICK_DESCRIPTION'),
            usage: '[Members] (...Reason)',
            permissions: 'KICK_MEMBERS',
            category: 'moderation'
        })
    }

    async run(msg, args) {
        const members = msg.members;
        if (!members?.length) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        const kickable = await this.getModeratable(msg.member, members, true);
        if (!kickable.length) return msg.responder.error('COMMAND_KICK_NOPERMS', members.length > 1);

        const reason = args.slice(members.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');

        await this.executeKicks(msg, reason, kickable);
        this.logActions(msg.guild, kickable.map(member => member.user), { type: 'mod', action: 'kick', reason, channel: msg.channel, dm: true, counter: 'kick', moderator: msg.member });
        return msg.responder.success();
    }

    async executeKicks(msg, reason, members) {
        for (const member of members) {
            member.kick(`${msg.author.tag} | ${reason}`)
                .catch((e) => msg.responder.error('COMMAND_KICK_ERROR', member.user.tag, e.message));
        }
    }
}