const Command = require('~/lib/structures/MultiModerationCommand');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            name: 'vcunmute',
            aliases: ['vcum', 'letsay', 'letspeak'],
            description: language => language.get('COMMAND_VCUNMUTE_DESCRIPTION'),
            usage: '[Members] (Reason)',
            category: 'moderation',
            permissions: 'MUTE_MEMBERS'
        })
    }

    async run(msg, args) {

        const members = msg.members;
        if (!members) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        let muteable = await this.getModeratable(msg.member, members, true);
        
        if (!muteable.length) return msg.responder.error('COMMAND_VCUNMUTE_NOPERMS', members.length > 1);
        muteable = muteable.filter(m => m.voice.channelID).filter(m => m.voice.serverMute);
        if (!muteable.length) return msg.responder.error('COMMAND_VCUNMUTE_NOVOICE', members.length > 1);

        let reason = args.slice(members.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');
        await this.executeUnmutes(msg, reason, muteable);
        this.logActions(msg.guild, muteable.map(m => m.user), { type: 'mod', action: 'vcunmute', reason, channel: msg.channel, dm: true, moderator: msg.member });
        return msg.responder.success();
    }

    async executeMutes(msg, reason, members) {

        for (const member of members) {
            await member.voice.setMute(false, `${msg.author.tag} | ${reason}`).catch(() => null);
        }
    }
}