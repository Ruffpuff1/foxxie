const { Language } = require('foxxie');
const MultiModerationCommand = require('../../lib/structures/MultiModerationCommand');

module.exports = {
    name: 'endTempban',
    async execute(client) {

        client.setInterval(async () => {
            const bannable = [];
            const bans = await client.schedule.fetch('bans');
            let moderator = null;
            let channel = null;
            let guild = null;
            let duration = null;
            let reason = null;
            bans?.forEach(async b => {
                
                const { guildId, authId, time, reason: res, channelId, userId, duration: dur } = b;
                
                guild = client.guilds.cache.get(guildId);
                if (!guild) return client.schedule.delete('bans', b);
                const user = client.users.cache.get(userId);
                if (!user) return client.schedule.delete('bans', b);
                moderator = guild.members.cache.get(authId);
                channel = guild.channels.cache.get(channelId);
                reason = res, duration = dur;

                if (Date.now() > time) {

                    this.executeUnbans(user, guild);
                    client.schedule.delete('bans', b);
                    bannable.push(user);
                }
            })

            setTimeout(() => {
                if (bannable.length) new MultiModerationCommand().logActions(guild, bannable.map(user => user), { type: 'mod', reason, channel, dm: true, moderator, action: 'tempunban', duration });
                if (bannable.length) bannable.forEach(u => bannable.splice(bannable.indexOf(u), 1));
            }, 3000)
        }, 1000)
    },

    executeUnbans(user, guild) {
        guild.members.unban(user.id, new Language(guild).get('TASKS_ENDTEMPBAN_REASON')).catch(() => null);
    }
}