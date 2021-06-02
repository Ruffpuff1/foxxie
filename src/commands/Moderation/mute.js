const ms = require('ms');

module.exports = {
    name: 'mute',
    aliases: ['m', 'silence', 'shush', 'quiet', '403', 'zip'],
    permissions: 'BAN_MEMBERS',
    usage: 'fox mute [user] (5s|5m|5h|5d|5w) (reason)',
    category: 'moderation',
    async execute (props) {

        const { message, args, language } = props;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.responder.error('COMMAND_MUTE_NOMEMBER');
        if (/^\d*[s|m|h|d|w|y]$/gmi.test(args[1])) await this.scheduleMutes(props, member) 

        const reason = /^\d*[s|m|h|d|w|y]$/gmi.test(args[1])
            ? args.slice(2).join(' ') || language.get('LOG_MODERATION_NOREASON')
            : args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON');

        let muterole = await message.guild.settings.get('mod.roles.mute');
        if (!message.guild.roles.cache.get(muterole)) muterole = await message.guild.createMuteRole();

        const duration = /^\d*[s|m|h|d|w|y]$/gmi.test(args[1]) ? ms(ms(args[1]), { long: true }) : null;
        await this.executeMutes(member, reason, muterole, message.member.user);
        await message.guild.log.send({ type: 'mod', action: duration ? 'tempmute' : 'mute', member, moderator: message.member, reason, channel: message.channel, duration: duration, dm: true, msg: message, counter: 'mute' })
        message.responder.success();
    },

    async scheduleMutes({ message, args, language}, member) {

        const reason = args.slice(2).join(" ") || language.get('LOG_MODERATION_NOREASON');
        message.client.schedule.create('mutes',
            { 
                guildId: message.guild.id,
                authId: message.author.id,
                time: Date.now() + ms(args[1]), 
                reason,
                channelId: message.channel.id,
                memberId: member.id,
                duration: ms(ms(args[1]), { long: true }) 
            }
        )
    },

    async executeMutes(member, reason, muterole, moderator) {
        member.mute(`${moderator.tag} | ${reason}`, muterole);
    }
}