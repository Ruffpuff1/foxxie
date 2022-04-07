const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const hugGif = [
	'https://i.imgur.com/fSj4xsv.gif',
	'https://i.imgur.com/AlggzEB.gif',
	'https://i.imgur.com/h6LkeSb.gif',
	'https://i.imgur.com/uftEWbo.gif',
	'https://i.imgur.com/YOMz4HG.gif',
	'https://i.imgur.com/mXpVUB6.gif',
	'https://i.imgur.com/kN6yX70.gif',
	'https://i.imgur.com/lm0mu7g.gif',
	'https://i.imgur.com/T92BEcP.gif',
	'https://i.imgur.com/ag8aPvT.gif',
	'https://i.imgur.com/cX8TGfN.gif',
	'https://i.imgur.com/9cqKUCK.gif',
	'https://i.imgur.com/Ny2t4Wi.gif',
	'https://i.imgur.com/wJhSneR.gif',
	'https://i.imgur.com/wIHZ1hw.gif',
	'https://i.imgur.com/MJ3jaK2.gif',
	'https://i.imgur.com/A7AGmcG.gif',
	'https://i.imgur.com/XFHve2D.gif',
	'https://i.imgur.com/TD3Qav1.gif',
	'https://i.imgur.com/6UBzYjC.gif'
];
module.exports = {
	name: 'hug',
	description: 'Hug your friends',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Huggiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Huggot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Huggiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Huggot`) || '0';
		}

		let hugText = args.slice(1).join(' ');
		if (mentionMember && hugText) {
			const hugMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** gives a hug to **${mentionMember.user.username}**.\n"${hugText}"`)
				.setImage(hugGif[Math.floor(Math.random() * hugGif.length)])
				.setFooter(`${mentionMember.user.username} has been hugged ${Got} times and hugged others ${Given} times.`);
			message.channel.send(hugMemberEmbed);
			return;
		}
		if (mentionMember) {
			const hugMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** gives a hug to **${mentionMember.user.username}**.`)
				.setImage(hugGif[Math.floor(Math.random() * hugGif.length)])
				.setFooter(`${mentionMember.user.username} has been hugged ${Got} times and hugged others ${Given} times.`);
			message.channel.send(hugMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you needa tell me who ya wanna hug. Try again with `fox hug [user] (reason)`');
			return;
		}
	}
};
