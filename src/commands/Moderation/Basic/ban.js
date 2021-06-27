const Command = require('~/lib/structures/MultiModerationCommand');
const { ms, Duration } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ban',
            aliases: ['b', 'bean', '410', 'yeet', 'banish', 'begone', 'perish'],
            description: language => language.get('COMMAND_BAN_DESCRIPTION'),
            requiredPermissions: ['BAN_MEMBERS', 'ADD_REACTIONS'],
            usage: '(Time) [Users] (Reason) (-p)',
            category: 'moderation'
        });

        this.permissions = 'BAN_MEMBERS';

        this.purge = /\-purge\s*|-p\s*/gi;
        this.duration = /^\d*[s|m|h|d|w|y]$/gmi;
    }

    async run(msg, args) {

        const users = msg.users;
        if (!users?.length) return msg.responder.error('MESSAGE_USERS_NONE');
        const bannable = await this.getModeratable(msg.member, users);
        if (!bannable.length) return msg.responder.error('COMMAND_BAN_NOPERMS', users.length > 1);

        const purge = this.purge.test(msg.content);
        const duration = this.duration.test(args[0]) ? new Duration(args[0]).fromNow : null;
        const timeLong = duration ? ms(ms(args[0]), { long: true }) : null;

        let reason = duration
            ? args.slice(users.length + 1).join(' ')
            : args.slice(users.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');

        const action = duration ? 'tempban' : 'ban';

        await this.executeBans(msg, reason.replace(this.purge, ''), bannable, purge, duration, timeLong);
        this.logActions(msg.guild, bannable.map(user => user), { type: 'mod', action, reason: reason.replace(this.purge, ''), channel: msg.channel, dm: true, counter: 'ban', moderator: msg.member, duration: timeLong });
        return msg.responder.success();
    }

    async executeBans(msg, reason, users, purge, duration, timeLong) {

        for (const user of users) {
            if (!duration) this.updateSchedule(user, msg);

            msg.guild.members.ban(user.id, { reason: `${duration ? `[temp]` : ''} ${msg.author.tag} | ${reason}`, days: purge ? 1 : 0 })
                .catch((e) => msg.responder.error('COMMAND_BAN_ERROR', user.tag, e.message));
        }
        if (duration) this.client.schedule.create('endTempban', duration, { data: 
            { users: users.map(user => user.id), guild: msg.guild.id, moderator: msg.member.id, channel: msg.channel.id, timeLong, reason } 
        })
    }

    updateSchedule(user, msg) {
		const unbanTask = this.client.schedule.tasks.find(task => task.taskName === 'endTempban' && task.data.users.includes(user.id) && task.data.guild === msg.guild.id);
		if (!unbanTask) return;
		const { time, data } = unbanTask;
		this.client.schedule.delete(unbanTask.id);
		data.users = data.users.filter(id => id !== user.id);
		if (data.users.length !== 0) { this.client.schedule.create('endTempban', time, { data }); }
	}
}