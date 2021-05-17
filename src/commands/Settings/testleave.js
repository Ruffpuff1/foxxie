const moment = require('moment');
module.exports = {
    name: 'testleave',
    aliases: ['testgoodbye', 'testbye', 'tl'],
    usage: 'fox testleave (member|userId)',
    category: 'settings',
    guildOnly: true,
    execute: async(props) => {

        let { message, args, lang, language } = props
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let goodbye = await message.guild.settings.get('goodbye');
        message.responder.success();
        if (!goodbye?.channel) return;
        let channel = message.guild.channels.cache.get(goodbye.channel);
        if (!channel) return;

        if (!goodbye?.message) return channel.send(language.get('EVENT_GUILDMEMBERREMOVE_DEFAULT_GOODBYEMESSAGE', lang, member));

        _fillTemplate = async (template, member) => {
            return template
            .replace(/{(name|username)}/gi, member.user.username)
            .replace(/{tag}/gi, member.user.tag)
            .replace(/{(discrim|discriminator)}/gi, member.user.discriminator)
            .replace(/{(guild|server)}/gi, member.guild.name)
            .replace(/{(membercount|count)}/gi, member.guild.memberCount)
            .replace(/{(joined|joinedat)}/gi, moment(member.joinedAt).format('MMMM Do YYYY'));
        }

        const parsed = await _fillTemplate(goodbye.message, member);
        channel.send(parsed);
    }
}