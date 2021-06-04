const Command = require('../../../lib/structures/MultiModerationCommand');

module.exports = {
    name: 'unmute',
    aliases: ['um', 'unzip', 'noise'],
    permissions: 'BAN_MEMBERS',
    usage: 'fox unmute [users] (reason)',
    category: 'moderation',
    async execute (props) {

        const { message, args, language } = props;

        const members = message.args.members() || message.args.memberIds();
        if (!members) return message.responder.error('MESSAGE_MEMBERS_NONE');
        const unmuteable = await new Command().getModeratable(message.member, members, true, message);
		if (!unmuteable.length) return message.responder.error('COMMAND_MUTE_NOPERMS', members.length > 1);

        const reason = args.slice(members.length).join(' ') || language.get('LOG_MODERATION_NOREASON');    
        await this.executeUnmutes(unmuteable, reason, props);
        await new Command().logActions(message.guild, unmuteable.map(member => member.user), { type: 'mod', reason, channel: message.channel, dm: true, moderator: message.member, action: 'unmute' })
        message.responder.success();
    },

    async executeUnmutes(members, reason, props) {
        for (const member of members) {
            member.unmute(reason);

            const mutes = await member.client.schedule.fetch('mutes');
            const hasmute = mutes?.some(m => m.memberId === member.user.id);
            if (hasmute) this.updateSchedule(props, member, mutes)
        }
    },

    async updateSchedule({ message }, member, mutes) {

        await mutes.filter(m => m.guildId === message.guild.id).filter(m => m.memberId === member.user.id).forEach(m => message.client.schedule.delete('mutes', m));
    }
}