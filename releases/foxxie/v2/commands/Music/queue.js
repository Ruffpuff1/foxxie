module.exports = {
	name: 'queue',
	description: 'see the current queue of the music channel',
	usuage: 'queue',
	aliases: ['q'],
	guildOnly: true,
	execute: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) {
			message.react('❌');
			message.channel.send(`I dunno what you want me to show since there's nothing playing right now.`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		const q = queue.songs.map((song, i) => `${i === 0 ? `⬐ current track\n` : `${i})`} ${song.name} - ${song.formattedDuration}`).join('\n');
		message.channel.send(`\`\`\`ml
${q}\`\`\``);

		console.log(q);
	}
};
