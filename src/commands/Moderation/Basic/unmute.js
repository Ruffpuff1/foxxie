const Command = require('~/lib/structures/MultiModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'unmute',
            aliases: ['um', 'unzip', 'noise'],
            description: language => language.get('COMMAND_UNMUTE_DESCRIPTION'),
            requiredPermissions: ['ADD_REACTIONS', 'MANAGE_ROLES'],
            usage: '[Members] (Reason)',
            category: 'moderation',
        })

        this.permissions = 'BAN_MEMBERS';
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
            this.updateSchedule(msg, member);
        }
    }

    async updateSchedule(msg, member) {
        const unmuteTask = this.client.schedule.tasks.find(task => task.taskName === 'endTempmute' && task.data.users.includes(member.id) && task.data.guild === msg.guild.id);
		if (!unmuteTask) return;
		const { time, data } = unmuteTask;
		this.client.schedule.delete(unmuteTask.id);
		data.users = data.users.filter(id => id !== member.id);
		if (data.users.length !== 0) { this.client.schedule.create('endTempmute', time, { data }); }
    }
}