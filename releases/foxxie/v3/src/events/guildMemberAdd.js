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
        function autoRole (roles){
            for (let role of roles){
                let memberRole = member.guild.roles.cache.find(r => r.id === role)
                member.roles.add(memberRole)
            }
        }
        function nicknameToLowerCase(){
            member.setNickname(member.user.username.toLowerCase())
        }

        if (member.guild.id === '825853736768372746') autoRole(['825882750534942730']) // foxxie's cubby
        if (member.guild.id === '824668932441899099') {
            autoRole(['824670868512702534']) // asteri
            nicknameToLowerCase()
        }
    }
}