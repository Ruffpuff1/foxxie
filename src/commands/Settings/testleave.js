const guildMemberRemove = require('../../events/guildMemberRemove');

module.exports = {
    name: 'testleave',
    aliases: ['testgoodbye', 'testbye', 'tl'],
    usage: 'fox testleave (member|userId)',
    category: 'settings',
    guildOnly: true,
    execute: async(props) => {

        let { message, args } = props
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        guildMemberRemove.execute(member);
        message.responder.success();
    }
}