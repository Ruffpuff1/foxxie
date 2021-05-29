module.exports = {
    name: 'mute',
    aliases: ['m', 'silence', 'shush', 'quiet', '403'],
    permissions: 'BAN_MEMBERS',
    usage: 'fox mute [user] (time) (reason)',
    category: 'moderation',
    async execute (props) {

        const { message, args, lang, language } = props;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return language.send('COMMAND_MUTE_NOMEMBER', lang);
        const reason = args[1] || language.get('LOG_MODERATION_NOREASON', lang);

        let muterole = await message.guild.settings.get('mod.roles.mute');
        if (!message.guild.roles.cache.get(muterole)) muterole = await message.guild.createMuteRole();

        await this.executeMutes(member, reason, muterole, message.member.user);
        await message.guild.log.send({ type: 'mod', action: duration ? 'tempmute' : 'mute', member, moderator: message.member, reason, channel: message.channel, duration: duration, dm: true, msg: message, counter: 'mute' })
        message.responder.success();
    },

    async executeMutes(member, reason, muterole, moderator) {
        member.mute(`${moderator.tag} | ${reason}`, muterole);
    }
}