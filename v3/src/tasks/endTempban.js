const { Task } = require('@foxxie/tails');

module.exports = class extends Task {
    
    async run({ users, guild, moderator, channel, timeLong, reason }) {
        
        const _guild = this.client.guilds.cache.get(guild);
        if (!_guild) return false;
        const _moderator = await _guild.members.fetch(moderator).catch(() => null);
        if (!_moderator) return false;
        const _channel = _guild.channels.cache.get(channel);

        users.forEach(async user => {
            const _user = await this.client.users.fetch(user).catch(() => null);
            if (!_user) return false;
            _guild.members.unban(user, `${_moderator.user.tag} | ${_guild.language.get('TASK_ENDTEMPBAN_REASON')}`).catch(() => null);
        })

        return this.client.commands.get('ban').logActions(_guild, users.map(id => this.client.users.cache.get(id)), {
            type: 'mod', reason, channel: _channel, dm: true, moderator: _moderator, action: 'tempunban', duration: timeLong
        })
    }
}