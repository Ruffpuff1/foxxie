module.exports = {
	name: 'pause',
	aliases: ['resume', 'unpause'],
	execute: async (client, message, args) => {
		const queue = client.distube.getQueue(message);

		if (!queue) {
			message.react('❌');
			return message.channel.send(`I don't know what you want me to pause since there's nothing in the queue.`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		if (queue.pause) {
			client.distube.resume(message);
			message.react('⏯');
			return message.channel.send('Resumed what you were playing earlier.');
		}
		client.distube.pause(message);
		message.react('⏸');
		message.channel.send("Gotcha I'll pause this for you.");
	}
};
