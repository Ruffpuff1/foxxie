module.exports = {
    name: 'unmute',
    aliases: ['um', 'unzip', 'noise'],
    permissions: 'BAN_MEMBERS',
    usage: 'fox unmute [user] (reason)',
    category: 'moderation',
    async execute (props) {

        const { message, args, language } = props;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.responder.error('COMMAND_UNMUTE_NOMEMBER');
        const reason = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON');
        let muterole = await message.guild.settings.get('mod.roles.mute');
        if (!message.guild.roles.cache.get(muterole)) muterole = await message.guild.createMuteRole();

        if (!member.roles.cache.has(muterole)) return message.responder.error('COMMAND_UNMUTE_NOTMUTED');
        await this.executeUnmutes(member, reason);
        const mutes = await message.client.schedule.fetch('mutes')
        if (mutes?.some(m => m.memberId === member.user.id)) await this.updateSchedule(props, member);
        message.guild.log.send({ type: 'mod', action: 'unmute', member, reason, moderator: message.member, dm: true, channel: message.channel })
        message.responder.success();
    },

    executeUnmutes(member, reason) {
        member.unmute(reason);
    },

    async updateSchedule({ message }, member) {
        const mutes = await message.client.schedule.fetch('mutes');
        mutes.forEach(m => {
            if (m.memberId === member.user.id) message.client.schedule.delete('mutes', m);
        })
    }
}