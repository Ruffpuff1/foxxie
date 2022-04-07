const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const cuddleGif = [
	'https://i.imgur.com/H9YU5hH.gif',
	'https://i.imgur.com/jx1ISK4.gif',
	'https://i.imgur.com/tORPt3D.gif',
	'https://i.imgur.com/bpfRL9Z.gif',
	'https://i.imgur.com/KnSUTxh.gif',
	'https://i.imgur.com/1ACONKL.gif',
	'https://i.imgur.com/WeepvfR.gif',
	'https://i.imgur.com/7hh3B4U.gif',
	'https://i.imgur.com/nIxBnwv.gif',
	'https://i.imgur.com/gMhWZDC.gif',
	'https://i.imgur.com/1ettVpm.gif',
	'https://i.imgur.com/1Jk3tKn.gif',
	'https://i.imgur.com/Mk3kqks.gif',
	'https://i.imgur.com/jMV5mqz.gif',
	'https://i.imgur.com/mqugk9O.gif',
	'https://i.imgur.com/7nnOTE7.gif',
	'https://i.imgur.com/1PXy0DP.gif'
];
module.exports = {
	name: 'cuddle',
	description: 'Cuddle with your friends.',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Cuddlegiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Cuddlegot`, 1);
			cuddleGiven = db.get(`Users_${mentionMember.user.id}_Cuddlegiven`) || '0';
			cuddleGot = db.get(`Users_${mentionMember.user.id}_Cuddlegot`) || '0';
		}

		let cuddleText = args.slice(1).join(' ');
		if (mentionMember && cuddleText) {
			const cuddleMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** cuddles with **${mentionMember.user.username}**.\n"${cuddleText}"`)
				.setImage(cuddleGif[Math.floor(Math.random() * cuddleGif.length)])
				.setFooter(`${mentionMember.user.username} has been cuddled ${cuddleGot} times and has cuddled others ${cuddleGiven} times.`);
			message.channel.send(cuddleMemberEmbed);
			return;
		}
		if (mentionMember) {
			const cuddleMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** cuddles with **${mentionMember.user.username}**.`)
				.setImage(cuddleGif[Math.floor(Math.random() * cuddleGif.length)])
				.setFooter(`${mentionMember.user.username} has been cuddled ${cuddleGot} times and has cuddled others ${cuddleGiven} times.`);
			message.channel.send(cuddleMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you needa tell me who ya wanna cuddle with. Try again with `fox cuddle [user] (reason)`');
			return;
		}
	}
};
