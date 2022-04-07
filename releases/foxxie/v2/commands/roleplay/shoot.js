const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const shootGif = [
	'https://i.imgur.com/B47YNf8.gif',
	'https://i.imgur.com/isoi36n.gif',
	'https://i.imgur.com/sKNDlej.gif',
	'https://i.imgur.com/IePQfGw.gif',
	'https://i.imgur.com/8uKSFTT.gif',
	'https://i.imgur.com/fc1kkaP.gif',
	'https://i.imgur.com/bwVdxBR.gif',
	'https://i.imgur.com/JjJ4Czk.gif',
	'https://i.imgur.com/FqdaVS3.gif',
	'https://i.imgur.com/huWNKnB.gif',
	'https://i.imgur.com/yG52cXs.gif',
	'https://i.imgur.com/UQihViR.gif',
	'https://i.imgur.com/vtJw0xX.gif',
	'https://i.imgur.com/SoWkUg0.gif'
];
module.exports = {
	name: 'shoot',
	aliases: ['snipe', 'longshot', '360noscope', 'noscope', 'quickscope', 'doubletap'],
	description: "Put a bullet through someone's head.",
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Shootgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Shootgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Shootgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Shootgot`) || '0';
		}

		let shootText = args.slice(1).join(' ');
		if (mentionMember && shootText) {
			const shootMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${mentionMember.user.username}** is sniping **${message.member.user.username}**.\n"${shootText}"`)
				.setImage(shootGif[Math.floor(Math.random() * shootGif.length)])
				.setFooter(`${mentionMember.user.username} has been shot ${Got} times and shot others ${Given} times.`);
			message.channel.send(shootMemberEmbed);
			return;
		}
		if (mentionMember) {
			const shootMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${mentionMember.user.username}** is sniping **${message.member.user.username}**.`)
				.setImage(shootGif[Math.floor(Math.random() * shootGif.length)])
				.setFooter(`${mentionMember.user.username} has been shot ${Got} times and shot others ${Given} times.`);
			message.channel.send(shootMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** who do you want to aim at? Try again with `fox shoot [user] (reason)`');
			return;
		}
	}
};
