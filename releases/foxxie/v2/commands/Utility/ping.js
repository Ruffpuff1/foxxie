const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'ping',
	aliases: ['pong', 'latency', 'lag', 'lagg'],
	description: 'Ping!',
	usage: 'ping',
	guildOnly: true,
	execute(client, message, args) {
		console.log('ping pong');
		message.reply('**Ping?**').then(resultMessage => {
			const ping = resultMessage.createdTimestamp - message.createdTimestamp;
			const pingEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.addFields(
					{
						name: '**Discord Latency**',
						value: `\`${ping} ms\``,
						inline: true
					},
					{
						name: '**Network Latency**',
						value: `\`${message.client.ws.ping} ms\``,
						inline: true
					}
				)
				.setFooter("Ping may be high due to Discord breaking, don't mind that.");

			resultMessage.edit(':ping_pong: **Pong**', { embed: pingEmbed });
		});
	}
};
