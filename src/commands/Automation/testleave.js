const { goodbyeMsg } = require('../../tasks/goodbyeMessage')
module.exports = {
    name: 'testleave',
    aliases: ['testgoodbye', 'testbye', 'tl'],
    usage: 'fox testjoin (member|userId)',
    category: 'automation',
    guildOnly: true,
    execute: async(props) => {

        let { message, args } = props

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        message.responder.success();
        goodbyeMsg(member)
    }
}