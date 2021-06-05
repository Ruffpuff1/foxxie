const ModerationCommand = require('./ModerationCommand');
const { GuildMember } = require('discord.js');

class MultiModerationCommand extends ModerationCommand {

	async getModeratable(executor, targets, memberOnly) {
		const ids = new Set();
        targets.forEach(async target => {
			if (!(target instanceof GuildMember)) { await executor.guild.members.fetch(target.id).catch(() => null); }
		});

		return targets.filter(t => {
            if (!t) return false;

            const member = executor.guild.members.cache.get(t.id);
            if (ids.has(t.id)) return false;
            ids.add(t.id);
            if (!member) return !memberOnly;
            return this.comparePermissions(executor, member);
        })
	}
}

module.exports = MultiModerationCommand;