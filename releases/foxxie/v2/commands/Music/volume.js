module.exports = {
	name: 'volume',
	aliases: ['set-volume', 'v'],
	inVoiceChannel: true,
	execute: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) {
			message.react('❌');
			return message.channel.send(`There's no songs in the queue right now. Dunno what volume you want me to change.`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		const volume = parseInt(args[0]);
		if (isNaN(volume)) {
			message.react('❌');
			return message.channel.send(`Gotta enter a valid number for me to switch the volume.`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		client.distube.setVolume(message, volume);
		message.react('🔉');
	}
};
