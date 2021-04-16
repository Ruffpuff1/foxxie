const { goodbyeMsg } = require('../../tasks/goodbyeMessage')
module.exports = {
    name: 'testleave',
    aliases: ['testgoodbye', 'testbye', 'tl'],
    usage: 'fox testjoin (member)',
    category: 'settings',
    guildOnly: true,
    execute: async(lang, message, args) => {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        goodbyeMsg(member)
    }
}