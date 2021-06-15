const { Task } = require('foxxie');
const MultiModerationCommand = require('../../lib/structures/MultiModerationCommand');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, {
            name: 'endTempmute'
        })
    }

    async run() {

        this.client.setInterval(async () => {
            const muteable = [];
            const mutes = await this.client.schedule.fetch('mutes');
            let moderator = null, channel = null, guild = null, duration = null, reason = null;
            
            mutes?.forEach(async mute => {

                const { guildId, authId, time, reason: res, channelId, memberId, duration: dur } = mute;

                guild = client.guilds.cache.get(guildId);
                if (!guild) return this.client.schedule.delete('mutes', mute);

                await guild.members.fetch(authId).catch(() => null);
                await guild.members.fetch(memberId).catch(() => null);

                const member = guild.members.cache.get(memberId);
                if (!member) return client.schedule.delete('mutes', mute);
                moderator = guild.members.cache.get(authId);
                channel = guild.channels.cache.get(channelId);
                reason = res, duration = dur;

                if (Date.now() > time) {
                    this.executeUnmutes(member);
                    this.client.schedule.delete('mutes', mute);
                    muteable.push(member);
                }
            })

            this.client.setTimeout(() => {
                if (muteable.length) new MultiModerationCommand().logActions(guild, muteable.map(member => member.user), {
                    type: 'mod', reason, channel, dm: true, moderator, action: 'tempunmute', duration
                })
                if (muteable.length) muteable.forEach(member => muteable.splice(muteable.indexOf(member), 1));
            }, 3000)
        }, 1000)
    }

    async executeUnmutes(member) {
        await member.unmute(member.guild.language.get('TASKS_ENDTEMPMUTE_REASON'));
    }
}