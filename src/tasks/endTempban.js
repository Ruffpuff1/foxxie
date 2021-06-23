const { Task } = require('foxxie');
const MultiModerationCommand = require('../../lib/structures/MultiModerationCommand');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, {
            name: 'endTempban'
        })
    }
    
    async run() {
        
        this.client.setInterval(async () => {
            const bannable = [];
            const bans = await this.client.schedule.fetch('bans');
            let moderator = null, channel = null, guild = null, duration = null, reason = null;
            bans?.forEach(async ban => {

                const { guildId, authId, time, reason: res, channelId, userId, duration: dur } = ban;
                guild = this.client.guilds.cache.get(guildId);
                if (!guild) return this.client.schedule.delete('bans', ban);

                await guild.members.fetch(authId).catch(() => null);
                await this.client.users.fetch(userId).catch(() => null);

                const user = this.client.users.cache.get(userId)?.user;
                if (!user) return this.client.schedule.delete('bans', ban);
                moderator = guild.members.cache.get(authId);
                channel = guild.channels.cache.get(channelId);
                reason = res, duration = dur;

                if (Date.now() > time) {
                    this.executeUnbans(user, guild, moderator);
                    this.client.schedule.delete('bans', ban);
                    bannable.push(user);
                }
            })

            this.client.setTimeout(() => {
                if (bannable.length) new MultiModerationCommand().logActions(guild, bannable.map(user => user), {
                    type: 'mod', reason, channel, dm: true, moderator, action: 'tempunban', duration
                })
                if (bannable.length) bannable.forEach(user => bannable.splice(bannable.indexOf(user), 1));
            }, 3000)
        }, 1000)
    }

    executeUnbans(user, guild, moderator) {
        guild.members.unban(user.id, `${moderator.user.tag} | ${guild.language.get('TASK_ENDTEMPBAN_REASON')}`).catch(() => null);
    }
}