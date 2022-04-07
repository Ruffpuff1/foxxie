const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../config.json');
module.exports = client => {
	client.on('messageUpdate', (oldMessage, newMessage) => {
		if (oldMessage.partial || newMessage.partial) return;
		if (newMessage.author.bot) return;
		let msgchn = db.get(`Guilds_${newMessage.guild.id}_Messagechannel`);
		if (msgchn === null) return;
		const messageChannel = newMessage.guild.channels.cache.get(msgchn);
		const messageEmbed = new Discord.MessageEmbed()
			.setTitle(`Message Edited by ${newMessage.author.tag}`)
			.setColor(foxColor)
			.setDescription(`Message by ${newMessage.author} edited in ${newMessage.channel}.`)
			.setFooter(`${newMessage.author.tag}`, newMessage.author.avatarURL({ dynamic: true }))
			.setTimestamp()
			.addFields(
				{
					name: 'Message ID:',
					value: `\`${newMessage.id}\``,
					inline: true
				},
				{
					name: 'Message Link:',
					value: `[Here](${newMessage.url})`,
					inline: true
				},
				{
					name: '\u200B',
					value: '\u200B',
					inline: true
				},
				{
					name: 'Before:',
					value: oldMessage.content,
					inline: false
				},
				{
					name: 'After:',
					value: newMessage.content,
					inline: false
				}
			);
		messageChannel.send(messageEmbed);
	});
};
