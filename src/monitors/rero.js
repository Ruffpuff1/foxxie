const { serverSettings } = require('../../lib/settings')
module.exports = {
    name: 'rero',
    execute: async (reaction, user, act) => {

        console.log('got reaction')

        let server = await serverSettings(reaction.message)
        if (server == null) return;
        if (server.reros == null) return;

        const member = reaction.message.guild ? await reaction.message.guild.members.fetch(user).catch(() => null) : null;
        if (!member) return;

        for (let rero of server.reros){

            if (reaction.emoji.id === rero[0].emoji || reaction.emoji.name === rero[0].emoji && reaction.message.id === rero[0].message) {

                let role = reaction.message.guild.roles.cache.find(r => r.id === rero[0].role)

                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
    }
}