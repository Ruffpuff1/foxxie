const Command = require('~/lib/structures/MultiModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'unmute',
            aliases: ['um', 'unzip', 'noise'],
            description: language => language.get('COMMAND_UNMUTE_DESCRIPTION'),
            permissions: 'BAN_MEMBERS',
            usage: '[Members] (Reason)',
            category: 'moderation',
        })
    }

    async run(msg, reason) {
        const members = msg.members;
        if (!members.length) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        const unmuteable = await this.getModeratable(msg.member, members, true);
        if (!unmuteable.length) return msg.responder.error('COMMAND_UNMUTE_NOPERMS', members.length > 1);

        reason = reason.slice(members.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');
        await this.executeUnmutes(msg, unmuteable, reason);
        await this.logActions(msg.guild, unmuteable.map(member => member.user), { type: 'mod', reason, channel: msg.channel, dm: true, moderator: msg.member, action: 'unmute' });
        return msg.responder.success();
    }

    async executeUnmutes(msg, members, reason) {
        for (const member of members) {
            member.unmute(`${msg.author.tag} | ${reason}`);
            const mutes = await this.client.schedule.fetch('mutes');
            const hasmute = mutes?.some(m => m.memberId === member.id);
            if (hasmute) this.updateSchedule(msg, member, mutes);
        }
    }

    async updateSchedule(msg, member, mutes) {
        await mutes.filter(m => m.guildId === msg.guild.id).filter(m => m.memberId === member.id).forEach(m => 
            this.client.schedule.delete('mutes', m)
        );
    }
}