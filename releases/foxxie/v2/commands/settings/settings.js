const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'settings',
	aliases: ['set'],
	usage: 'setmessagechannel [#channel]',
	description: 'See the many settings of the server.',
	guildOnly: true,
	permission: 'ADMINISTRATOR',
	execute(client, message, args) {
		welChannel = db.get(`Guilds_${message.guild.id}_Welchannel`) || 'No welcome channel is set';
		byeChannel = db.get(`Guilds_${message.guild.id}_Byechannel`) || 'No goodbye channel is set';
		logChannel = db.get(`Guilds_${message.guild.id}_Logchannel`) || 'No mod log channel is set';
		msgChannel = db.get(`Guilds_${message.guild.id}_Messagechannel`) || 'No edit logging channel is set';
		prefix = db.get(`Guilds_${message.guild.id}_Prefix`) || 'No custom prefix is set. Default is `.` or `fox`.';

		wel = db.has(`Guilds_${message.guild.id}_Welchannel`) ? `<#${welChannel}>` : 'No welcome channel is set';
		bye = db.has(`Guilds_${message.guild.id}_Byechannel`) ? `<#${byeChannel}>` : 'No goodbye channel is set';
		log = db.has(`Guilds_${message.guild.id}_Logchannel`) ? `<#${logChannel}>` : 'No mod log channel is set';
		msg = db.has(`Guilds_${message.guild.id}_Messagechannel`) ? `<#${msgChannel}>` : 'No edit logging channel is set';

		const settingsEmbed = new Discord.MessageEmbed()
			.setAuthor(`Settings for Foxxie in ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setDescription(`Here are the server settings for **${message.guild.name}**. You can find the commands to adjust these settings in the help menu.`)
			.setColor(foxColor)
			.addFields(
				{
					name: '**Prefix**',
					value: prefix,
					inline: true
				},
				{
					name: '**Verbosity**',
					value: '3 (Default)',
					inline: true
				},
				{
					name: '**Language**',
					value: 'English',
					inline: true
				},
				{
					name: '**Bot Channel**',
					value: 'No bot channel is set',
					inline: true
				},
				{
					name: '**Cooldown**',
					value: '0.6 Seconds (Default)',
					inline: true
				},
				{
					name: '\u200B',
					value: '\u200B',
					inline: true
				},
				{
					name: '**Helper Role**',
					value: 'No helper role is set',
					inline: true
				},
				{
					name: '**Moderator Role**',
					value: 'No moderator role is set',
					inline: true
				},
				{
					name: '**Admin Role**',
					value: 'No admin role is set',
					inline: true
				},
				{
					name: '**Welcome Channel**',
					value: `${wel}`,
					inline: true
				},
				{
					name: '**Goodbye Channel**',
					value: `${bye}`,
					inline: true
				},
				{
					name: '**Boost Channel**',
					value: 'No boost channel is set',
					inline: true
				},
				{
					name: '**Modlog Channel**',
					value: `${log}`,
					inline: true
				},
				{
					name: '**Message Logging Channel**',
					value: `${msg}`,
					inline: true
				},
				{
					name: '**Disboard Channel**',
					value: 'No disboard channel is set',
					inline: true
				},
				{
					name: '**Ignored Channels**',
					value: `\`\`\`
No channels are ignored in this server
                    \`\`\``,
					inline: false
				},
				{
					name: '**Disabled Channels**',
					value: `\`\`\`
No commands are disabled in this server
                    \`\`\``,
					inline: false
				},
				{
					name: '**Disabled Sections**',
					value: `\`\`\`
No sections are disabled in this server
                    \`\`\``,
					inline: false
				},
				{
					name: '**Blacklisted users**',
					value: 'No users are blacklisted in this server',
					inline: false
				},
				{
					name: '**Other Settings**',
					value: 'Other Settings to be added soon.',
					inline: false
				}
			);
		message.channel.send(settingsEmbed);
	}
};
