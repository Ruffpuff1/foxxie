const { Task } = require('@foxxie/tails');

module.exports = class extends Task {
    
    async run({ users, guild, moderator, channel, timeLong, reason }) {
        
        const _guild = this.client.guilds.cache.get(guild);
        if (!_guild) return false;
        const _moderator = await _guild.members.fetch(moderator).catch(() => null);
        if (!_moderator) return false;
        const _channel = _guild.channels.cache.get(channel);

        users.forEach(async user => {
            const _member = await _guild.members.fetch(user).catch(() => null);
            if (!_member) return false;
            _member.unmute(`${_moderator.user.tag} | ${_guild.language.get('TASK_ENDTEMPMUTE_REASON')}`);
        })

        return this.client.commands.get('mute').logActions(_guild, users.map(id => this.client.users.cache.get(id)), {
            type: 'mod', reason, channel: _channel, dm: true, moderator: _moderator, action: 'tempunmute', duration: timeLong
        })
    }
}