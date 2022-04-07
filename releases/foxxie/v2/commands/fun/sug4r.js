module.exports = {
	name: 'sug4r',
	aliases: ['sami', 'samira'],
	guildOnly: true,
	execute(client, message, args) {
		message.delete();
		message.channel.send(`:beverage_box::bug:`);
	}
};
