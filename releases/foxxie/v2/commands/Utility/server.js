const Discord = require('discord.js');
const moment = require('moment');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'server',
	aliases: ['serverinfo', 'server-info'],
	description: 'Provides server Id, Total members, and creation date',
	usage: 'server',
	guildOnly: true,
	execute(client, message, args) {
		const servercreated = moment(message.guild.createdAt).format('llll');
		let dayssincecreation = moment().diff(servercreated, 'days');
		let monthssincecreation = Math.floor(dayssincecreation / 30);
		let days = dayssincecreation;
		if (dayssincecreation > 30) dayssincecreation = Math.floor(days / monthssincecreation - 20);

		const staff = message.guild.roles.cache.find(r => r.id === '818506873950175264');

		let membermap =
			message.guild.roles.cache
				.sort((a, b) => b.position - a.position)
				.map(r => r.name)
				.slice(0, 55)
				.join(', ') + `\nand more...`;
		if (membermap.length > 1024) membermap = 'To many members to display';
		if (!membermap) membermap = 'No members';

		const serverEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setTitle(`**${message.guild.name} (ID: ${message.guild.id})**`)
			.setDescription(`Here\'s some info about **${message.guild.name}**`)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.addFields(
				{
					name: ':crown: **Owner**',
					value: `${message.guild.owner.user.tag}`,
					inline: true
				},
				{
					name: ':busts_in_silhouette: **Members**',
					value: `**${message.guild.memberCount}** Users`,
					inline: true
				},
				{
					name: `:sunglasses: **Emotes (${message.guild.emojis.cache.size})**`,
					value: `${message.guild.emojis.cache.size}`,
					inline: true
				},
				{
					name: ':map: **Region**',
					value: `${message.guild.region}`,
					inline: true
				},
				{
					name: `:speech_balloon: **Channels (${message.guild.channels.cache.size})**`,
					value: `Text: **${message.guild.channels.cache.filter(c => c.type === 'text').size}**\nVoice: **${
						message.guild.channels.cache.filter(c => c.type === 'voice').size
					}**`,
					inline: true
				},
				{ name: `\u200B`, value: `\u200B`, inline: true },
				{
					name: `:scroll: **Roles (${message.guild.roles.cache.size})**`,
					value: `\`\`\`${membermap}\`\`\``,
					inline: false
				},
				{
					name: ':calendar: **Created At**',
					value: `${servercreated} **(${dayssincecreation} days and ${monthssincecreation} months ago.)**`,
					inline: false
				}
			);

		message.reply(serverEmbed);
	}
};
