const Command = require('../../../lib/structures/MultiModerationCommand');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'warn',
            aliases: ['w'],
            description: language => language.get('COMMAND_WARN_DESCRIPTION'),
            usage: '[Members] (Reason)',
            permissions: 'MANAGE_MESSAGES',
            category: 'moderation'
        })
    }

    async run(msg, args) {

        const members = msg.members;
        if (!members?.length || !members[0]) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        const warnable = await this.getModeratable(msg.member, members, true);
        if (!warnable.length) return msg.responder.error('COMMAND_WARN_NOPERMS', members.length > 1);

        const reason = args.slice(members.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');
        await this.executeWarns(msg, reason, warnable);
        this.logActions(msg.guild, warnable.map(member => member.user), { type: 'mod', action: 'warn', reason, channel: msg.channel, dm: true, counter: 'warn', moderator: msg.member });
        return msg.responder.success();
    }

    async executeWarns(msg, reason, members) {

        const warn = { author: msg.member, reason, timestamp: new Date().getTime()}

        for (const member of members) {
            member.user.settings.push(`servers.${msg.guild.id}.warnings`, warn);

            const warns = await member.user.settings.get(`servers.${msg.guild.id}.warnings`);
            if (warns?.length >= 3 && msg.guild.id === '761512748898844702') await this.tcsWarn(msg, member, warns.length);
        }
    }

    tcsWarn(msg, member, count) {
        const channel = msg.guild.channels.cache.get('817006909492166656');
        if (!channel) return member;
        return channel.send(`${member.user.tag} (ID: ${member.user.id}) now has **${count}** warnings.`)
    }
}