module.exports = {
	name: 'play',
	description: 'play a song in a voice channel',
	aliases: ['pl'],
	usage: 'play [song name/youtube link]',
	guildOnly: true,
	execute: async (client, message, args) => {
		const string = args.join(' ');
		if (!string) {
			message.react('❌');
			return message.channel.send(`Cmon enter a proper song for me to search.`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		try {
			client.distube.play(message, string);
		} catch (e) {
			message.react('❌');
			message.channel.send(`\`${e}\``).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
	}
};
