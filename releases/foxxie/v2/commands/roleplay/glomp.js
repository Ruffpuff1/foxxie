const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const glompGif = [
	'https://i.imgur.com/qU4oPoH.gif',
	'https://i.imgur.com/TMd3YZB.gif',
	'https://i.imgur.com/VVzC0Cz.gif',
	'https://i.imgur.com/aCHCjPw.gif',
	'https://i.imgur.com/tXhfaVa.gif',
	'https://i.imgur.com/yv4KeBx.gif',
	'https://i.imgur.com/DzE8iXw.gif',
	'https://i.imgur.com/SXeyR3k.gif',
	'https://i.imgur.com/KSrqnAt.gif',
	'https://i.imgur.com/BwLK4fO.gif',
	'https://i.imgur.com/k0EEt7C.gif',
	'https://i.imgur.com/GnERTWn.gif'
];
module.exports = {
	name: 'glomp',
	aliases: ['jump'],
	description: 'Jump on someone for a big hug',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Glompgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Glompgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Glompgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Glompgot`) || '0';
		}

		let glompText = args.slice(1).join(' ');
		if (mentionMember && glompText) {
			const glompMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is glomping **${mentionMember.user.username}**.\n"${glompText}"`)
				.setImage(glompGif[Math.floor(Math.random() * glompGif.length)])
				.setFooter(`${mentionMember.user.username} has been glomped ${Got} times and glomped others ${Given} times.`);
			message.channel.send(glompMemberEmbed);
			return;
		}
		if (mentionMember) {
			const glompMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is glomping **${mentionMember.user.username}**.`)
				.setImage(glompGif[Math.floor(Math.random() * glompGif.length)])
				.setFooter(`${mentionMember.user.username} has been glomped ${Got} times and glomped others ${Given} times.`);
			message.channel.send(glompMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you needa tell me who ya wanna jump on for a hug. Try again with `fox glomp [user] (reason)`');
			return;
		}
	}
};
