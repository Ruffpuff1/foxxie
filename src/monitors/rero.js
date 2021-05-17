module.exports = {
    name: 'rero',
    type: 'reaction',
    execute: async (reaction, user, act) => {
        
        let server = await reaction.message.guild.settings.get('reros'); if (!server) return;
        const member = reaction.message.guild ? await reaction.message.guild.members.fetch(user).catch(() => null) : null; if (!member) return;
        for (let rero of server){

            if (reaction.emoji.id === rero.emoji || reaction.emoji.name === rero.emoji && reaction.message.id === rero.message) {

                let role = reaction.message.guild.roles.cache.find(r => r.id === rero.role)
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
    }
}