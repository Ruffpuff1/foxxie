module.exports = {
	name: 'ruff',
	guildOnly: true,
	execute(client, message, args) {
		message.delete();
		message.channel.send(`<:PUmbreonCoffee:816751699552894977>`);
	}
};
