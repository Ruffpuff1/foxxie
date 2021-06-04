const ms = require('ms');
const MultiModerationCommand = require('../../../lib/structures/MultiModerationCommand');

module.exports = {
    name: 'mute',
    aliases: ['m', 'silence', 'shush', 'quiet', '403', 'zip'],
    permissions: 'BAN_MEMBERS',
    usage: 'fox mute (5s|5m|5h|5d|5w) [users] (reason)',
    category: 'moderation',
    async execute (props) {

        const { message, args, language } = props;

        const members = message.args.members() || message.args.memberIds();
        if (!members) return message.responder.error('MESSAGE_MEMBERS_NONE');
        const muteable = await new MultiModerationCommand().getModeratable(message.member, members, true, message);
		if (!muteable.length) return message.responder.error('COMMAND_MUTE_NOPERMS', members.length > 1);

        const reason = /^\d*[s|m|h|d|w|y]$/gmi.test(args[0])
            ? args.slice(members.length + 1).join(' ') || language.get('LOG_MODERATION_NOREASON')
            : args.slice(members.length).join(' ') || language.get('LOG_MODERATION_NOREASON');

        let muterole = await message.guild.settings.get('mod.roles.mute');
        if (!message.guild.roles.cache.get(muterole)) muterole = await message.guild.createMuteRole();

        const duration = /^\d*[s|m|h|d|w|y]$/gmi.test(args[0]) ? ms(ms(args[0]), { long: true }) : null;
        await this.executeMutes(muteable, reason, muterole, message.member.user, /^\d*[s|m|h|d|w|y]$/gmi.test(args[0]) ? Date.now() + ms(args[0]) : null, message, args);
        await new MultiModerationCommand().logActions(message.guild, muteable.map(member => member.user), { type: 'mod', reason, channel: message.channel, dm: true, msg: message, counter: 'mute', moderator: message.member, action: duration ? 'tempmute' : 'mute', duration })
        message.responder.success();
    },

    async scheduleMutes(member, message, duration, reason, args, mutes) {

        await mutes.filter(m => m.guildId === message.guild.id).filter(m => m.memberId === member.user.id).forEach(m => message.client.schedule.delete('mutes', m));
        message.client.schedule.create('mutes',
            { guildId: message.guild.id, authId: message.author.id, time: duration, reason, channelId: message.channel.id, memberId: member.user.id, duration: ms(ms(args[0]), { long: true }) }
        )
    },

    async executeMutes(members, reason, muterole, moderator, duration, message, args) {
        for (const member of members) {
            member.mute(`${moderator.tag} | ${reason}`, muterole);

            const mutes = await message.client.schedule.fetch('mutes');
            const hasmute = mutes?.some(m => m.memberId === member.user.id);
            if (duration || hasmute) this.scheduleMutes(member, message, duration, reason, args, mutes)
        }
    }
}