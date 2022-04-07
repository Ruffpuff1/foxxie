const { goodbyeMsg } = require('../tasks/goodbyeMessage')
module.exports = {
    name: 'guildMemberRemove',
    execute: async(member) => {
        goodbyeMsg(member);
    }
}