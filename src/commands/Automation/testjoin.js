const { welcomeMessage } = require('../../../lib/util/theCornerStore')
const { welcomeMsg } = require('../../tasks/welcomeMessage')
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'testjoin',
    aliases: ['testwelcome', 'tw'],
    usage: 'fox testjoin (member|userId)',
    category: 'automation',
    guildOnly: true,
    execute: async(props) => {

        let { message, args } = props

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        message.react(approved)
        if (message.guild.id === '761512748898844702') {
            welcomeMessage(member)
            return;
        }
        welcomeMsg(member)
    }
}