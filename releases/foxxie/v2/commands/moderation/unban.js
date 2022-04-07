module.exports = {
	name: 'ban',
	aliases: ['b'],
	description: 'Ban a user from the guild so they can no longer return, will also send a message in the log channel if sent and sends a DM to the user banned.',
	usage: '[user] (reason)',
	guildOnly: true,
	permissions: 'BAN_MEMBERS',
	execute(client, message, args) {}
};
