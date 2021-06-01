const Language = require('../../lib/Language');

module.exports = {
    name: 'endTempmute',
    async execute(client) {

        client.setInterval(async () => {

            const mutes = await client.schedule.fetch('mutes');
            mutes?.forEach(async m => {

                const { guildId, authId, time, reason, channelId, memberId, duration } = m;
                
                const guild = client.guilds.cache.get(guildId);
                if (!guild) return client.schedule.delete('mutes', m);
                const member = guild.members.cache.get(memberId);
                if (!member) return client.schedule.delete('mutes', m);
                const moderator = guild.members.cache.get(authId);
                const channel = guild.channels.cache.get(channelId);

                if (Date.now() > time) {
                    this.executeUnmutes(member);
                    guild.log.send({ type: 'mod', action: 'tempunmute', member, moderator, reason, channel, dm: true, duration, guild })
                    client.schedule.delete('mutes', m);
                }
            })
        }, 1000)
    },

    async executeUnmutes(member) {
        await member.unmute(new Language(member.guild).get('TASKS_ENDTEMPMUTE_REASON'));
    }
}