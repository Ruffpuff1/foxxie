const { ms, Duration } = require('foxxie');
const Command = require('~/lib/structures/MultiModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'mute',
            aliases: ['m', 'silence', 'shush', 'quiet', '403', 'zip'],
            description: language => language.get('COMMAND_MUTE_DESCRIPTION'),
            usage: '(Time) [Users] (...Reason)',
            permissions: 'BAN_MEMBERS',
            category: 'moderation',
        });

        this.duration = /^\d*[s|m|h|d|w|y]$/gmi;
    }

    async run(msg, args) {
        const members = msg.members;
        if (!members) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        const muteable = await this.getModeratable(msg.member, members, true);
        if (!muteable.length) return msg.responder.error('COMMAND_MUTE_NOPERMS', members.length > 1);

        const duration = this.duration.test(args[0]) ? new Duration(args[0]).fromNow : null;
        const timeLong = duration ? ms(ms(args[0]), { long: true }) : null;
        const action = duration ? 'tempmute' : 'mute';

        let reason = duration
            ? args.slice(members.length + 1).join(' ')
            : args.slice(members.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');

        const muterole = await msg.guild.settings.get('mod.roles.mute');
        if (!msg.guild.roles.cache.get(muterole)) muterole = await msg.guild.createMuteRole();

        await this.executeMutes(msg, reason, muteable, muterole, duration, timeLong)
        await this.logActions(msg.guild, muteable.map(member => member.user), { type: 'mod', reason, channel: msg.channel, dm: true, counter: 'mute', moderator: msg.member, action, duration: timeLong });
        msg.responder.success();
    }

    async executeMutes(msg, reason, members, muterole, duration, timeLong) {
        for (const member of members) {
            if (!duration) this.updateSchedule(member, msg);
            member.mute(`${msg.author.tag} | ${reason}`, muterole);
        }
        if (duration) this.client.schedule.create('endTempmute', duration, { data: 
            { users: members.map(member => member.user.id), guild: msg.guild.id, moderator: msg.member.id, channel: msg.channel.id, timeLong, reason } 
        })
    }

    updateSchedule(member, msg) {
        const unmuteTask = this.client.schedule.tasks.find(task => task.taskName === 'endTempmute' && task.data.users.includes(member.id) && task.data.guild === msg.guild.id)
        if (!unmuteTask) return;
        const { time, data } = unmuteTask;
        this.client.schedule.delete(unmuteTask.id);
        data.users = data.users.filter(id => id !== member.id);
        if (data.users.length !== 0) { this.client.schedule.create('endTempmute', time, { data }); }
    }
}