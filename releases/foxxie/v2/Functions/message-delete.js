const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../config.json');
module.exports = client => {
	client.on('messageDelete', message => {
		if (message.partial) return;
		if (message.author.bot) return;
		let msgchn = db.get(`Guilds_${message.guild.id}_Messagechannel`);
		if (msgchn === null) return;
		const messageChannel = message.guild.channels.cache.get(msgchn);
		const MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`Message Deleted by ${message.author.tag}`)
			.setColor(foxColor)
			.setDescription(`Message by ${message.author} deleted in ${message.channel}.`)
			.setFooter(`${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp()
			.addFields(
				{
					name: 'Message ID:',
					value: `\`${message.id}\``,
					inline: true
				},
				{
					name: '\u200B',
					value: '\u200B',
					inline: true
				},
				{
					name: '\u200B',
					value: '\u200B',
					inline: true
				},
				{
					name: 'Content:',
					value: message.content,
					inline: false
				}
			);
		messageChannel.send(MessageEmbed);
	});
};
