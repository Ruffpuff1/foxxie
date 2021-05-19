const guildMemberAdd = require('../../events/guildMemberAdd');

module.exports = {
    name: 'testjoin',
    aliases: ['testwelcome', 'tw'],
    usage: 'fox testjoin (member|userId)',
    category: 'settings',
    guildOnly: true,
    execute: async(props) => {

        let { message, args } = props

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        guildMemberAdd.execute(member);
        message.responder.success();
    }
}