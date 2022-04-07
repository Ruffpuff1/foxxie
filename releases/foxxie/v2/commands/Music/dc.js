module.exports = {
	name: 'disconnect',
	aliases: ['dc', 'leave'],
	description: 'Disconnects Foxxie from the voice channel',
	guildOnly: true,
	usage: 'disconnect',
	execute: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) {
			message.react('❌');
			return message.channel.send(`Nothing to stop since you're not playing anything right now.`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		client.distube.stop(message);
		message.react('👋');
	}
};
