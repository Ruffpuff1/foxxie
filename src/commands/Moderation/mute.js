const { ms } = require('foxxie');
const Command = require('../../../lib/structures/MultiModerationCommand');

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
    }

    async run(msg, args) {
        const members = msg.members;
        if (!members) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        const muteable = await this.getModeratable(msg.member, members, true);
        if (!muteable.length) return msg.responder.error('COMMAND_MUTE_NOPERMS', member.length > 1);

        const reason = /^\d*[s|m|h|d|w|y]$/gmi.test(args[0])
            ? args.slice(members.length + 1).join(' ') || msg.language.get('LOG_MODERATION_NOREASON')
            : args.slice(members.length).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');

        const muterole = await msg.guild.settings.get('mod.roles.mute');
        if (!msg.guild.roles.cache.get(muterole)) muterole = await msg.guild.createMuteRole();

        const duration = /^\d*[s|m|h|d|w|y]$/gmi.test(args[0]) ? ms(ms(args[0]), { long: true }) : null;
        await this.executeMutes(muteable, reason, muterole, msg.author, /^\d*[s|m|h|d|w|y]$/gmi.test(args[0]) ? Date.now() + ms(args[0]) : null, msg, args);
        await this.logActions(msg.guild, muteable.map(member => member.user), { type: 'mod', reason, channel: msg.channel, dm: true, counter: 'mute', moderator: msg.member, action: duration ? 'tempmute' : 'mute', duration });
        msg.responder.success();
    }

    async executeMutes(members, reason, muterole, moderator, duration, msg, args) {
        for (const member of members) {
            member.mute(`${moderator.tag} | ${reason}`, muterole);
            const mutes = await this.client.schedule.fetch('mutes');
            const hasmute = mutes?.some(m => m.memberId === member.id);
            if (duration || hasmute) this.scheduleMutes(member, msg, duration, reason, args, mutes);
        }
    }

    async scheduleMutes(member, msg, duration, reason, args, mutes) {
        await mutes.filter(m => m.guildId === msg.guild.id).filter(m => m.memberId === member.id).forEach(m => this.client.schedule.delete('mutes', m));
        this.client.schedule.create('mutes',
            { guildId: msg.guild.id, authId: msg.author.id, time: duration, reason, channelId: msg.channel.id, memberId: member.user.id, duration: ms(ms(args[0]), { long: true }) }
        )
    }
}