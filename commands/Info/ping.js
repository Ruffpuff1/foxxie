const Discord = require('discord.js');

module.exports = {
	name: 'ping',
	aliases: ['pong', 'latency', 'lag', 'lagg'],
	description: 'Ping!',
	usage: '',
	guildOnly: false,
	execute(message, args, text, client) {
		
console.log('ping pong');

message.reply('**Calculating ping...**').then(resultMessage => {
	const ping = resultMessage.createdTimestamp - message.createdTimestamp

	const pingEmbed = new Discord.MessageEmbed()
	.setColor('#EC8363')
	.addFields(
		{ name: '**Bot Latency**', value: `\`${ping} ms\`` , inline: true },
		{ name: '**API Latency**', value: `\`${message.client.ws.ping} ms\`` , inline: true },
	)
	.setFooter('Discord API issues could lead to high roundtrip times');

	resultMessage.edit(':ping_pong: **Pong**', {embed: pingEmbed,})
       })

		},

	};