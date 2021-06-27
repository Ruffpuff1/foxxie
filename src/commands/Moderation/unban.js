const Command = require('~/lib/structures/MultiModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'unban',
            aliases: ['ub', 'unbean'],
            description: language => language.get('COMMAND_UNBAN_DESCRIPTION'),
            usage: '[Users] (Reason)',
            permissions: 'BAN_MEMBERS',
            category: 'moderation'
        })
    }

    async run(msg, reason) {
        const users = msg.users;
        if (!users.length) return msg.responder.error('MESSAGE_USERS_NONE');
        const bannable = await this.getModeratable(msg.member, users);
        if (!bannable.length) return msg.responder.error('COMMAND_UNBAN_NOPERMS', users.length > 1);

        reason = reason.slice(users.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');
        await this.executeUnbans(msg, bannable, reason);
        await this.logActions(msg.guild, bannable.map(user => user), { type: 'mod', reason, channel: msg.channel, dm: true, moderator: msg.member, action: 'unban' });
        return msg.responder.success();
    }

    async executeUnbans(msg, users, reason) {
        for (const user of users) {
            msg.guild.members.unban(user, `${msg.author.tag} | ${reason}`).catch(() => null);
            this.updateSchedule(msg, user);
        }
    }

    async updateSchedule(msg, user) {
        const unbanTask = this.client.schedule.tasks.find(task => task.taskName === 'endTempban' && task.data.users.includes(user.id) && task.data.guild === msg.guild.id);
		if (!unbanTask) return;
		const { time, data } = unbanTask;
		this.client.schedule.delete(unbanTask.id);
		data.users = data.users.filter(id => id !== user.id);
		if (data.users.length !== 0) { this.client.schedule.create('endTempban', time, { data }); }
    }
}