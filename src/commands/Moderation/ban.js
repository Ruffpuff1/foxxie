const Command = require('../../../lib/structures/MultiModerationCommand');
const { ms } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ban',
            aliases: ['b', 'bean', '410', 'yeet', 'banish', 'begone', 'perish'],
            description: language => language.get('COMMAND_BAN_DESCRIPTION'),
            usage: '(Time) [Users] (Reason) (-p)',
            permissions: 'BAN_MEMBERS',
            category: 'moderation'
        });

        this.purge = /\-purge\s*|-p\s*/gi;
        this.duration = /^\d*[s|m|h|d|w|y]$/gmi;
    }

    async run(msg, args) {

        const users = msg.users;
        if (!users) return msg.responder.error('MESSAGE_USERS_NONE');
        const bannable = await this.getModeratable(msg.member, users);
        if (!bannable.length) return msg.responder.error('COMMAND_BAN_NOPERMS', users.length > 1);

        const purge = this.purge.test(msg.content);
        const duration = this.duration.test(args[0]) ? ms(ms(args[0]), { long: true }) : null;
        const time = duration ? Date.now() + ms(args[0]) : null;

        let reason = this.duration.test(args[0])
            ? args.slice(users.length + 2).join(' ')
            : args.slice(users.length + 1).join(' ');

        const action = time ? 'tempban' : 'ban';
        if (!reason) reason = msg.language.get('LOG_MODERATION_NOREASON');

        await this.executeBans(msg, reason.replace(this.purge, ''), bannable, purge, time, duration);
        this.logActions(msg.guild, bannable.map(user => user), { type: 'mod', action, reason: reason.replace(this.purge, ''), channel: msg.channel, dm: true, counter: 'ban', moderator: msg.member, duration });
        return msg.responder.success();
    }

    async executeBans(msg, reason, users, purge, time, duration) {

        for (const user of users) {
            if (purge) msg.guild.members.ban(user.id, { reason: `${duration ? `[temp]` : ''} ${msg.author.tag} | ${reason}`, days: 1 })
                .catch((e) => msg.responder.error('COMMAND_BAN_ERROR', user.tag, e.message));

            if (!purge) msg.guild.members.ban(user.id, { reason: `${duration ? `[temp]` : ''} ${msg.author.tag} | ${reason}` })
                .catch((e) => msg.responder.error('COMMAND_BAN_ERROR', user.tag, e.message));

            const bans = await this.client.schedule.fetch('bans');
            const hasban = bans?.some(b => b.userId === user.id);
            if (duration || hasban) this.scheduleBans(msg, user, time, reason, duration, bans);
        }
    }

    async scheduleBans(msg, user, time, reason, duration, bans) {

        if (bans?.length) await bans.filter(b => b.userId === user.id).filter(b => b.guildId === msg.guild.id).forEach(b => this.client.schedule.delete('bans', b));
        this.client.schedule.create('bans',
            { guildId: msg.guild.id, authId: msg.author.id, time, reason, channelId: msg.channel.id, userId: user.id, duration }
        )
    }
}