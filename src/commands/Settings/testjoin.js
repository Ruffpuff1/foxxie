const { welcomeMessage } = require('../../../lib/util/theCornerStore')
const { welcomeMsg } = require('../../tasks/welcomeMessage')
module.exports = {
    name: 'testjoin',
    aliases: ['testwelcome', 'tw'],
    usage: 'fox testjoin (member)',
    category: 'settings',
    guildOnly: true,
    execute: async(lang, message, args, client) => {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if (message.guild.id === '761512748898844702') {
            welcomeMessage(member)
            message.delete();
            return;
        }
        welcomeMsg(member)
    }
}