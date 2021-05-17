const { welcomeMessage } = require('../../../lib/util/theCornerStore');
module.exports = {
    name: 'testjoin',
    aliases: ['testwelcome', 'tw'],
    usage: 'fox testjoin (member|userId)',
    category: 'settings',
    guildOnly: true,
    execute: async(props) => {

        let { message, args, lang, language } = props

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        message.responder.success();
        if (message.guild.id === '761512748898844702') return welcomeMessage(member)
         
        let welcome = await message.guild.settings.get('welcome');
        if (!welcome?.channel) return;
        let channel = message.guild.channels.cache.get(welcome.channel);
        if (!welcome?.message) return channel.send(language.get('EVENT_GUILDMEMBERADD_DEFAULT_WELCOMEMESSAGE', lang, member));

        _fillTemplate = async (template, member) => {
            return template
                .replace(/{(member|user|mention)}/gi, member.toString())
                .replace(/{(name|username)}/gi, member.user.username)
                .replace(/{tag}/gi, member.user.tag)
                .replace(/{(discrim|discriminator)}/gi, member.user.discriminator)
                .replace(/{(guild|server)}/gi, member.guild.name)
                .replace(/{(membercount|count)}/gi, member.guild.memberCount)
                .replace(/{(created|createdat)}/gi, moment(member.user.createdAt).format('MMMM Do YYYY'));
        };
        const parsed = await _fillTemplate(welcome.message, member);
        channel.send(parsed);
    }
}