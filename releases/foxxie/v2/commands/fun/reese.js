module.exports = {
	name: 'reese',
	guildOnly: true,
	execute(client, message, args) {
		message.delete();
		message.channel.send(`<:PVulpixAngel:816747766406578234>`);
	}
};
