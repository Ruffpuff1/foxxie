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
            const bans = await this.client.schedule.fetch('bans');
            const hasban = bans?.some(b => b.userId === user.id);
            if (hasban) this.updateSchedule(msg, user, bans);
        }
    }

    async updateSchedule(msg, user, bans) {
        await bans.filter(b => b.guildId === msg.guild.id).filter(b => b.userId === user.id).forEach(b => 
            this.client.schedule.delete('bans', b)    
        )
    }
}