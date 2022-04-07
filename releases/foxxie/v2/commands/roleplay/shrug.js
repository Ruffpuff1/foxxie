const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const shrugGif = [
	'https://i.imgur.com/aj8ExVs.gif',
	'https://i.imgur.com/ED6oNNr.gif',
	'https://i.imgur.com/BCDC1O1.gif',
	'https://i.imgur.com/24Yu9BS.gif',
	'https://i.imgur.com/DKHNKft.gif',
	'https://i.imgur.com/rknQDCe.gif',
	'https://i.imgur.com/PxRfxjG.gif',
	'https://i.imgur.com/fHwva3O.gif',
	'https://i.imgur.com/C51YMqu.gif',
	'https://i.imgur.com/tZggUke.gif'
];
module.exports = {
	name: 'shrug',
	aliases: ['whatever', 'whateves', 'shrugs'],
	description: "Let people see how many of those f's you still have to give",
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Shruggiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Shruggot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Shruggiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Shruggot`) || '0';
		}

		GivenAuth = db.get(`Users_${message.author.id}_Shruggiven`) || '0';

		let shrugText = args.slice(1).join(' ');
		if (mentionMember && shrugText) {
			const shrugMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is shrugging **${mentionMember.user.username}** off.\n"${shrugText}"`)
				.setImage(shrugGif[Math.floor(Math.random() * shrugGif.length)])
				.setFooter(`${mentionMember.user.username} has been shrugged at ${Got} times and shrugged at others ${Given} times.`);
			message.channel.send(shrugMemberEmbed);
			return;
		}
		if (mentionMember) {
			const shrugMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is shrugging at **${mentionMember.user.username}** off.`)
				.setImage(shrugGif[Math.floor(Math.random() * shrugGif.length)])
				.setFooter(`${mentionMember.user.username} has been shrugged at ${Got} times and shrugged at others ${Given} times.`);
			message.channel.send(shrugMemberEmbed);
			return;
		}
		if (!mentionMember) {
			const shrugEmbed = new Discord.MessageEmbed()
				.setColor('#EC8363')
				.setDescription(`**${message.member.user.username}** is shrugging.`)
				.setImage(shrugGif[Math.floor(Math.random() * shrugGif.length)])
				.setFooter(`${message.member.user.username} has shrugged ${GivenAuth} times.`);
			message.channel.send(shrugEmbed);
			return;
		}
	}
};
