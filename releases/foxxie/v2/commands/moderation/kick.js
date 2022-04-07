const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const moment = require('moment');
module.exports = {
	name: 'kick',
	aliases: ['k'],
	description: 'Kick a user from the guild. Will also send a message to the log channel if set and will DM the user kicked.',
	usage: '[user] (reason)',
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let reason = args.slice(1).join(' ') || 'No Reason Provided';
		let isBot = '812546582531801118';
		const kickTime = moment(message.createdTimestamp).format('llll');
		let logchn = db.get(`Guilds_${message.guild.id}_Logchannel`);

		if (mentionMember) {
			console.log(mentionMember.id);
		}
		if (!mentionMember) {
			message.react('❌');
			message.channel.send("❌ **Y'know,** if you want me to kick someone you gotta tell me who. Try again with `.kick [user] (reason)`").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		if (mentionMember === message.member) {
			message.react('❌');
			message.channel.send("❌ **Heyyy,** you can't exactly kick yourself y'know").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		if (mentionMember.id === isBot) {
			message.react('❌');
			message.channel.send('❌ **Heyy,** why would you want to kick me?').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		if (!mentionMember.kickable) {
			message.react('❌');
			message.channel.send("❌ **Sorry!** I can't kick this dude.").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		const kickEmbed = new Discord.MessageEmbed()
			.setTitle(`Kicked ${mentionMember.user.tag}`)
			.setColor(foxColor)
			.setTimestamp()
			.addFields(
				{
					name: '**Kicked User**',
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
				{ name: `**Date / Time**`, value: `${kickTime}`, inline: true }
			);

		const kickDmEmbed = new Discord.MessageEmbed()
			.setTitle(`Kicked from ${message.guild.name}`)
			.setColor(foxColor)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setDescription(`You have been kicked from ${message.guild.name} with the following reason:\n\`\`\`${reason}\`\`\``);

		db.add(`Users_${mentionMember.user.id}_Gotkicked_${message.guild.id}`, 1);
		mentionMember
			.send(kickDmEmbed)
			.catch(error => console.error(error))
			.then(() => {
				mentionMember.kick();
				console.log(`kicked ${mentionMember} for ${reason}`);

				db.add(`Users_${message.author.id}_Kicks_${message.guild.id}`, 1);

				message.react('✅');

				if (logchn === null) return;

				const logChannel = message.guild.channels.cache.get(logchn);

				logChannel.send(kickEmbed);
			});
	}
};
