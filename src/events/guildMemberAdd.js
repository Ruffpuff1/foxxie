const { welcomeMessage } = require('../../lib/util/theCornerStore')
const { welcomeMsg } = require('../tasks/welcomeMessage')
module.exports = {
    name: 'guildMemberAdd',
    execute: async(member) => {
        if (member.guild.id === '761512748898844702') {
            welcomeMessage(member)
            return;
        }
        welcomeMsg(member);
    }
}