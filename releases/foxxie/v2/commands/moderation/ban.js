const moment = require('moment');
const db = require('quick.db');
const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'ban',
	aliases: ['b'],
	description: 'Ban a user from the guild so they can no longer return, will also send a message in the log channel if sent and sends a DM to the user banned.',
	usage: '[user] (reason)',
	guildOnly: true,
	permissions: 'BAN_MEMBERS',
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let reason = args.slice(1).join(' ') || 'No Reason Provided';
		let isBot = '812546582531801118';
		let logchn = db.get(`Guilds_${message.guild.id}_Logchannel`);
		const banTime = moment(message.createdTimestamp).format('llll');

		if (mentionMember) {
			console.log(mentionMember.id);
		}
		if (!mentionMember) {
			message.react('❌');
			message.channel.send("❌ **Y'know,** if you want me to ban someone you gotta tell me who. Try again with `.ban [user] (reason)`").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		if (mentionMember === message.member) {
			message.react('❌');
			message.channel.send("❌ **Heyyy,** you can't exactly ban yourself y'know").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		if (mentionMember.id === isBot) {
			message.react('❌');
			message.channel.send('❌ **Heyy,** why would you want to ban me?').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		if (!mentionMember.bannable) {
			message.react('❌');
			message.channel.send("❌ **Sorry!** I can't exactly ban this dude.").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		const banEmbed = new Discord.MessageEmbed()
			.setTitle(`Banned ${mentionMember.user.tag}`)
			.setColor(foxColor)
			.setTimestamp()
			.addFields(
				{
					name: '**Banned User**',
					value: `${mentionMember} (ID: ${mentionMember.user.id})`,
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
				{ name: `**Date / Time**`, value: `${banTime}`, inline: true }
			);

		const banDmEmbed = new Discord.MessageEmbed()
			.setTitle(`Banned from ${message.guild.name}`)
			.setColor(foxColor)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setDescription(`You have been banned from ${message.guild.name} with the following reason:\n\`\`\`${reason}\`\`\``);

		mentionMember
			.send(banDmEmbed)
			.catch(error => console.error(error))
			.then(() => {
				mentionMember.ban({ reason: `${reason}` });
				console.log(`banned ${mentionMember} for ${reason}`);

				db.add(`Users_${message.author.id}_Bans_${message.guild.id}`, 1);

				message.react('✅');

				if (logchn === null) return;

				const logChannel = message.guild.channels.cache.get(logchn);

				logChannel.send(banEmbed);
			});
	}
};
