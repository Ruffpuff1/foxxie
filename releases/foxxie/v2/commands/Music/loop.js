module.exports = {
	name: 'loop',
	aliases: ['repeat', 'lp'],
	usage: 'repeat [off/song/queue]',
	description: 'Set or remove a loop for the song playing',
	guildOnly: true,
	execute: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) {
			message.react('❌');
			return message.channel.send(`Dunno what you want me to loop since there's nothing playing.`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		let mode = null;
		switch (args[0]) {
			case 'off':
				mode = 0;
				break;
			case 'song':
				mode = 1;
				break;
			case 'queue':
				mode = 2;
				break;
		}
		mode = client.distube.setRepeatMode(message, mode);
		mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off';
		if (args[0] == 'off') message.react('✅');
		if (args[0] == 'song') message.react('🔁');
		if (args[0] == 'queue') message.react('🔂');
	}
};
