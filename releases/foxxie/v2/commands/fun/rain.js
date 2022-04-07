module.exports = {
	name: 'rain',
	guildOnly: true,
	execute(client, message, args) {
		message.delete();
		message.channel.send(`<:PMewBlush:816772472984174622>`);
	}
};
