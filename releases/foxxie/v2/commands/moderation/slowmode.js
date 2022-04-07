const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'slowmode',
	aliases: ['slowchat', 'slow', 'freeze', 's'],
	description: 'Enable slowmode in a channel. Unlike with normal Discord, doing this through a bot allows for any amount of time between 1 second and 6 hours.',
	usage: '[seconds] (reason)',
	guildOnly: true,
	permissions: 'MANAGE_CHANNELS',
	execute(client, message, args) {
		let logchn = db.get(`Guilds_${message.guild.id}_Logchannel`);

		const slowTime = moment(message.createdTimestamp).format('llll');
		let reason = args.slice(1).join(' ') || 'none';

		let amount = Math.floor(args[0]);
		if (isNaN(amount)) {
			message.react('❌');
			return message.channel.send("❌ Heya that's not exactly a number, I dunno how you expect me to put a slowmode of that").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}

		if (amount > 21600 || amount < 0) {
			message.react('❌');
			return message.channel.send("❌ Uhhh due to discord's *issues* I can't accept a number that big or small try again with a valid number please.").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}

		message.channel.setRateLimitPerUser(amount);

		const slowmodeEmbed = new Discord.MessageEmbed()
			.setTitle(`Slowmode ${amount} seconds`)
			.setColor(foxColor)
			.setTimestamp()
			.addFields(
				{
					name: '**Slowmode Duration**',
					value: `${amount} seconds`,
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
				{ name: `**Date / Time**`, value: `${slowTime}`, inline: true }
			);

		db.add(`Users_${message.author.id}_Slowmodes_${message.guild.id}`, 1);

		message.react('✅');

		if (logchn === null) return;

		const logChannel = message.guild.channels.cache.get(logchn);

		logChannel.send(slowmodeEmbed);
	}
};
