const { goodbyeMsg } = require('../../tasks/goodbyeMessage')
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'testleave',
    aliases: ['testgoodbye', 'testbye', 'tl'],
    usage: 'fox testjoin (member|userId)',
    category: 'settings',
    guildOnly: true,
    execute: async(lang, message, args) => {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        message.react(approved)
        goodbyeMsg(member)
    }
}