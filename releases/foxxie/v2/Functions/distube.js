const DisTube = require('distube');
const { foxColor } = require('../config.json');
const Discord = require('discord.js');

module.exports = client => {
	client.distube.on('addSong', (message, queue, song) => {
		const addEmbed = new Discord.MessageEmbed().setDescription(`Queued [${song.name}](${song.url}) [${song.user}]`).setColor(foxColor);
		message.channel.send(addEmbed);
	});
	const status = queue => `Loop: ${queue.repeatMode ? (queue.repeatMode == 2 ? 'Server Queue' : 'This Song') : 'Off'}`;

	client.distube.on('playSong', (message, queue, song) => {
		const playingEmbed = new Discord.MessageEmbed()
			.setTitle(`Now Playing`)
			.setColor(foxColor)
			.setDescription(`[${song.name}](${song.url}) [${song.user}]`)
			.setTimestamp()
			.setFooter(`${status(queue)}`);
		message.channel.send(playingEmbed).then(msg => {
			setTimeout(() => msg.delete(), song.duration * 1000);
		});
		console.log(song.duration * 1000);
	});
};
