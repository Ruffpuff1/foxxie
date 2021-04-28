const { serverSettings } = require('../../lib/settings')
module.exports = {
    name: 'rero',
    execute: async (reaction, user, act) => {

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
    // TCS Age rero
    if (reaction.message.id === '836539974793953300') {
        if (reaction.emoji.name === '👶') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '813223401723658291')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '🧑') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '813223405394198568')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '🧑‍🦳') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '813223408560373771')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
    }
    // TCS Pronoun rero
    if (reaction.message.id === '836540662999941190') {
        if (reaction.emoji.name === '💙') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '762100003140272170')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '💛') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '762100163363471392')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '💜') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '762100095805816843')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
    }
    // TCS Region rero
    if (reaction.message.id === '836541382666747945') {
        if (reaction.emoji.name === '🇺🇸') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '767686341554601994')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '🇧🇷') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '767686398949326879')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '🇪🇺') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '767686456931254272')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '🇨🇳') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '767686502020677632')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '🇪🇬') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '767686753514684436')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '🇳🇿') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '767686554654474240')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
    }
    // Tcs Ping rero
    if (reaction.message.id === '836541590687318027') {
        if (reaction.emoji.name === '👋') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '774173127717552139')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '👊') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '774339676487548969')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '📅') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '779245805360906240')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '🍪') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '798088767763120168')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
        if (reaction.emoji.name === '💕') {
            if (member) {
                let role = reaction.message.guild.roles.cache.find(r => r.id === '796513704761753670')
                if (act === 'add') member.roles.add(role)
                if (act === 'remove') member.roles.remove(role)
            }
        }
    }
}