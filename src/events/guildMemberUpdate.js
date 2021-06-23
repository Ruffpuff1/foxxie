const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'guildMemberUpdate'
        })
    }

    async run(old, member) {
        if (old.pending && !member.pending) this.autorole(member);
        if (old.displayName === member.displayName) return;
        this.uppercase(member);
    }

    async uppercase(member) {
        const uppercase = await member.guild.settings.get('mod.anti.uppercase');
        if (!uppercase) return;
        member.setNickname(member.displayName.toLowerCase(), member.guild.language.get('EVENT_GUILDMEMBERUPDATE_UPPERCASE_REASON')).catch(() => null)
    }

    async autorole(member) {
		// autoroles
		await member.guild.log.send({ member, type: 'member', action: 'passedGate' });
		const autoroles = await member.guild.settings.get('mod.roles.auto');
		if (autoroles.length && !member.user.bot) {
			await member.roles.add(autoroles, member.guild.language.get('EVENT_GUILDMEMBERUPDATE_AUTOROLE_REASON')).catch(() => null);
		}
	}
}