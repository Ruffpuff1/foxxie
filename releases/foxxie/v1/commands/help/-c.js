module.exports = {
	name: '-c',
	aliases: ['inserver'],
	description: 'keeps the help command in the server',
	usage: '',
	guildOnly: false,
	execute(message, args, text, client) {
		console.log('put the help cmd in channel');
	}
};
