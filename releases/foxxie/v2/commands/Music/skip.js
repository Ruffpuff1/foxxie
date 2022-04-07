module.exports = {
	name: 'skip',
	aliases: ['next', 'sk'],
	inVoiceChannel: true,
	execute: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) {
			message.react('❌');
			return message.channel.send(`I dunno what you want me to skip. Nothing really in the queue right now.`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		try {
			client.distube.skip(message);
			message.react('⏭');
		} catch (e) {
			message.react('❌');
			message.channel.send(`${e}`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
	}
};
