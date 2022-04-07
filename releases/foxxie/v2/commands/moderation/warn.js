const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
let random_string = require('randomstring');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'warn',
	aliases: ['w'],
	usage: 'warn [user/userid] (reason)',
	description: 'Warn a user for a breaking a rule. You can view all warnings of a user with the warnings command.',
	permissions: 'MANAGE_MESSAGES',
	execute: async (client, message, args) => {
		let user;
		if (args[0] && isNaN(args[0])) user = message.mentions.users.first();
		if (args[0] && !isNaN(args[0])) {
			user = client.users.cache.get(args[0]);

			if (!message.guild.members.cache.has(args[0])) {
				message.react('❌');
				return message.channel.send("I can't really give a warning to a person who isn't in the server.").then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
		}

		const warnDate = moment(message.createdTimestamp).format('llll');
		let logchn = db.get(`Guilds_${message.guild.id}_Logchannel`);

		if (!user) {
			message.react('❌');
			return message.channel.send('You gotta enter a user ID okay?').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}

		if (user.bot) {
			message.react('❌');
			return message.channel.send("Why warn a bot? That's kinda unnecessary don't ya think?").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}

		if (user.id == message.author.id) {
			message.react('❌');
			return message.channel.send("I don't know why you'd want to warn yourself.").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}

		if (message.guild.members.cache.get(user.id).roles.highest.position > message.member.roles.highest.position) {
			message.react('❌');
			return message.channel.send("That user has higher permissions than me, means I can't warn them bud.").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		if (!user) {
			message.react('❌');
			return message.channel.send('Well if you want to warn someone you gotta tell me who, trying pinging them.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}

		let res = args.slice(1).join(' ');

		let warnID = await random_string.generate({
			charset: 'numeric',
			length: 6
		});

		console.log(`${user.id} warned ID: ${warnID}`);

		db.push(`Users_${user.id}_Warnings_${message.guild.id}_Info`, {
			moderator: message.author.tag,
			modID: message.author.id,
			reason: res ? res : 'None',
			date: warnDate,
			id: warnID
		});
		db.add(`Users_${user.id}_Warnings_${message.guild.id}_Number`, 1);

		const warnEmbed = new Discord.MessageEmbed()
			.setTitle(`Warned ${user.tag}`)
			.setColor(foxColor)
			.setTimestamp()
			.addFields(
				{
					name: '**Warned User**',
					value: `${user} (ID: ${user.id})`,
					inline: true
				},
				{
					name: '**Moderator**',
					value: `<@${message.author.id}> (ID: ${user.id})`,
					inline: true
				},
				{ name: '\u200B', value: '\u200B', inline: true }
			)
			.addFields(
				{ name: `**Reason**`, value: `${res}`, inline: true },
				{
					name: `**Location**`,
					value: `<#${message.channel.id}>`,
					inline: true
				},
				{ name: `**Date / Time**`, value: `${warnDate}`, inline: true }
			);

		const warnDmEmbed = new Discord.MessageEmbed()
			.setTitle(`Warned in ${message.guild.name}`)
			.setColor(foxColor)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setDescription(`You have been warned in ${message.guild.name} with the following reason:\n\`\`\`${res}\`\`\``);

		user.send(warnDmEmbed).catch(error => console.error(error));

		db.add(`Users_${message.author.id}_Warns_${message.guild.id}`, 1);

		let num = db.get(`Users_${user.id}_Warnings_${message.guild.id}_Number`);

		message.react('✅');
		message.channel.send(`**Got it,** warned ${user.username} for: **${res}**. They now have ${num} warnings.`).then(msg => {
			setTimeout(() => msg.delete(), 10000);
		});

		if (logchn === null) return;

		const logChannel = message.guild.channels.cache.get(logchn);

		logChannel.send(warnEmbed);
	}
};
