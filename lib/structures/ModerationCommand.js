class ModerationCommand {

	comparePermissions(executor, target) {
		if (executor.guild.ownerID === executor.id) return executor.id !== target.id;
		return executor.roles.highest.position > target.roles.highest.position;
	}

    logActions(guild, users, options) {
		if (users.length > 1) {
			options.users = users;
		} else {
			[options.user] = users;
		}
		guild.log.send(options);
	}

}

module.exports = ModerationCommand;