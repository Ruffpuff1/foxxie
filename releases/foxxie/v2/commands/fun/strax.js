module.exports = {
	name: 'straxer',
	aliases: ['straxy', 'strax'],
	guildOnly: true,
	execute(client, message, args) {
		message.delete();
		message.channel.send(`<a:boop:822179684745084938>`);
	}
};
