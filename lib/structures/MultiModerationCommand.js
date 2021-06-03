const ModerationCommand = require('./ModerationCommand');
const { Message } = require('discord.js');

class MultiModerationCommand extends ModerationCommand {

	async getModeratable(executor, targets, memberOnly, message) {
		const ids = new Set();
		return targets.filter(t => {
            if (!t) return false;

            if (ids.has(t.id)) return false;
            ids.add(t.id);

            const member = executor.guild.members.cache.get(t.id);
            if (!member && !memberOnly) return memberOnly;
            return this.comparePermissions(executor, member);
        })
	}

}

module.exports = MultiModerationCommand;
