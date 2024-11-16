const Discord = require('discord.js');

module.exports = {
	name: 'server',
	aliases: ['serverinfo', 'server-info'],
	description: 'Provides server Id, Total members, and creation date',
	usage: '',
	guildOnly: true,
	execute(message, args) {
		const servercreated = new Date(message.guild.createdAt).toLocaleDateString();
		const serverTimeCreated = new Date(message.guild.createdAt).toLocaleTimeString();


		const serverEmbed = new Discord.MessageEmbed()
		.setColor('#EC8363')
		.setTitle(`**${message.guild.name} (ID: ${message.guild.id})**`)

		.setDescription(`Here is some information about **${message.guild.name}**`)
		.setThumbnail(message.guild.iconURL())

		.addFields(
			{ name: ':crown: **Owner**', value: `${message.guild.owner}` , inline: true },
			{ name: ':busts_in_silhouette: **Members**', value: `**${message.guild.memberCount}** Users` , inline: true },
			{ name: ':sunglasses: **Emotes**', value: `${message.guild.emojis.cache.size}` , inline: true },
		)
		.addFields(
			{ name: ':map: **Region**', value: `${message.guild.region}` , inline: true },
			{ name: ':speech_balloon: **Channels**', value: `${message.guild.channels.cache.size}` , inline: true },
		)
		.addField(`:scroll: **Roles**`, `${message.guild.roles.cache.size}`, false)
        .addField(':calendar: Created At', `${servercreated}\n**(${serverTimeCreated})**`, false)
		
			message.reply(serverEmbed);
	},
};