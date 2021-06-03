const Language = require('../../lib/Language');
const MultiModerationCommand = require('../../lib/structures/MultiModerationCommand');

module.exports = {
    name: 'endTempmute',
    async execute(client) {

        client.setInterval(async () => {
            const muteable = [];
            const mutes = await client.schedule.fetch('mutes');
            let moderator = null;
            let channel = null;
            let guild = null;
            let duration = null;
            let reason = null;
            mutes?.forEach(async m => {
                
                const { guildId, authId, time, reason: res, channelId, memberId, duration: dur } = m;
                
                guild = client.guilds.cache.get(guildId);
                if (!guild) return client.schedule.delete('mutes', m);
                const member = guild.members.cache.get(memberId);
                if (!member) return client.schedule.delete('mutes', m);
                moderator = guild.members.cache.get(authId);
                channel = guild.channels.cache.get(channelId);
                reason = res;
                duration = dur;

                if (Date.now() > time) {

                    this.executeUnmutes(member);
                    client.schedule.delete('mutes', m);
                    muteable.push(member);
                }
            })

            setTimeout(() => {
                if (muteable.length) new MultiModerationCommand().logActions(guild, muteable.map(member => member.user), { type: 'mod', reason, channel, dm: true, moderator, action: 'tempunmute', duration });
                if (muteable.length) muteable.forEach(m => muteable.splice(muteable.indexOf(m), 1));
            }, 3000)
        }, 1000)
    },

    async executeUnmutes(member) {
        await member.unmute(new Language(member.guild).get('TASKS_ENDTEMPMUTE_REASON'));
    }
}