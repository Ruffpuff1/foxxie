const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const boopGif = [
	'https://i.imgur.com/elQrpb0.gif',
	'https://i.imgur.com/dfUkKA0.gif',
	'https://i.imgur.com/OOGnKe6.gif',
	'https://i.imgur.com/zT4YOSC.gif',
	'https://i.imgur.com/7bJtvkO.gif',
	'https://i.imgur.com/3VD4C3Q.gif',
	'https://i.imgur.com/zbEm4ja.gif',
	'https://i.imgur.com/JPYPCGH.gif',
	'https://i.imgur.com/MjJBjHl.gif',
	'https://i.imgur.com/nfXlWLX.gif',
	'https://i.imgur.com/Abzspl1.gif'
];
module.exports = {
	name: 'boop',
	description: 'Boop a user on the nose.',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Boopgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Boopgot`, 1);
			boopsGiven = db.get(`Users_${mentionMember.user.id}_Boopgiven`) || '0';
			boopsGot = db.get(`Users_${mentionMember.user.id}_Boopgot`) || '0';
		}

		let boopText = args.slice(1).join(' ');

		if (mentionMember && boopText) {
			const boopMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${mentionMember.user.username}** got booped by **${message.member.user.username}**.\n"${boopText}"`)
				.setImage(boopGif[Math.floor(Math.random() * boopGif.length)])
				.setFooter(`${mentionMember.user.username} has been booped ${boopsGot} times and booped others ${boopsGiven} times.`);

			message.channel.send(boopMemberEmbed);
			return;
		}
		if (mentionMember) {
			const boopMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${mentionMember.user.username}** got booped by **${message.member.user.username}**.`)
				.setImage(boopGif[Math.floor(Math.random() * boopGif.length)])
				.setFooter(`${mentionMember.user.username} has been booped ${boopsGot} times and booped others ${boopsGiven} times.`);
			message.channel.send(boopMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Heya** you needa tell me who ya wanna boop. Try again with `fox boop [user] (reason)`');
			return;
		}
	}
};
