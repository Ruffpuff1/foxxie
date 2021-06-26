const { Event } = require('@foxxie/tails');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'globalBan'
        })
    }

    async run(member) {
        await member.guild.members.ban(member.id, { reason: member.guild.language.get('EVENT_GLOBALBAN_REASON') }).catch(() => null);
        await member.guild.log.send({ type: 'mod', action: 'globalBan', moderator: member.guild.me, reason: member.guild.language.get('EVENT_GLOBALBAN_REASON'), counter: 'ban', user: member.user, dm: true });
        return member;
    }
}