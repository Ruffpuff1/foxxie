const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'unlock',
	aliases: ['ul'],
	permissions: 'MANAGE_CHANNELS',
	execute: async (client, message, args) => {
		let logchn = db.get(`Guilds_${message.guild.id}_Logchannel`);
		let reason = args.slice(0).join(' ') || 'none';
		const lockTime = moment(message.createdTimestamp).format('llll');

		if (!db.has(`Guilds.${message.guild.id}_Locked_${message.channel.id}`)) return message.reply("This channel isn't locked.");

		let msg = await message.channel.send('Finding the keys...');

		try {
			db.delete(`Guilds.${message.guild.id}_Locked_${message.channel.id}`);
			message.channel.updateOverwrite(
				message.guild.roles.cache.find(e => e.name.toLowerCase().trim() == '@everyone'),
				{
					SEND_MESSAGES: true
				}
			);
			message.react('🔓');

			db.add(`Users_${message.author.id}_Unlocks_${message.guild.id}`, 1);

			msg.edit('**Successfully** unlocked the channel ;)').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		} catch (e) {
			message.channel.send(e);
		}

		const lockEmbed = new Discord.MessageEmbed()
			.setTitle(`Unlocked channel`)
			.setColor(foxColor)
			.setTimestamp()
			.addFields(
				{
					name: '**Channel unlocked**',
					value: `<#${message.channel.id}>`,
					inline: true
				},
				{
					name: '**Moderator**',
					value: `<@${message.member.user.id}> (ID: ${message.member.user.id})`,
					inline: true
				},
				{ name: '\u200B', value: '\u200B', inline: true }
			)
			.addFields(
				{ name: `**Reason**`, value: `${reason}`, inline: true },
				{
					name: `**Location**`,
					value: `<#${message.channel.id}>`,
					inline: true
				},
				{ name: `**Date / Time**`, value: `${lockTime}`, inline: true }
			);

		if (logchn === null) return;

		const logChannel = message.guild.channels.cache.get(logchn);

		logChannel.send(lockEmbed);
	}
};
