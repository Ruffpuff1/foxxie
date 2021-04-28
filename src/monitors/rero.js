module.exports = {
    name: 'rero',
    execute: async (reaction, user, act) => {

        let reros = [ { emoji: '824751934539825232', message: '836790354858606644', role: '825929686634856459' } ]
        const member = reaction.message.guild ? await reaction.message.guild.members.fetch(user).catch(() => null) : null;
        if (!member) return;

        for (let rero of reros){
            console.log('emoji:', rero.emoji)
            console.log('message:', rero.message)
            if (reaction.emoji.id === rero.emoji && reaction.message.id === rero.message) {
                console.log('role:', rero.role)
                let role = reaction.message.guild.roles.cache.find(r => r.id === rero.role)

                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
    }
}