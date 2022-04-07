const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const peckGif = [
	'https://i.imgur.com/sheFPzu.gif',
	'https://i.imgur.com/54tqOiT.gif',
	'https://i.imgur.com/yqTxIS1.gif',
	'https://i.imgur.com/rsYkor2.gif',
	'https://i.imgur.com/XYUUp1P.gif',
	'https://i.imgur.com/q8C7r38.gif',
	'https://i.imgur.com/kvFs2LC.gif',
	'https://i.imgur.com/ehB79YQ.gif',
	'https://i.imgur.com/A7ADc4k.gif'
];
module.exports = {
	name: 'peck',
	description: 'Give a quick peck',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Peckgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Peckgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Peckgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Peckgot`) || '0';
		}

		let peckText = args.slice(1).join(' ');
		if (mentionMember && peckText) {
			const peckMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** gave a quick peck to **${mentionMember.user.username}**.\n"${peckText}"`)
				.setImage(peckGif[Math.floor(Math.random() * peckGif.length)])
				.setFooter(`${mentionMember.user.username} has been pecked ${Got} times and pecked others ${Given} times.`);
			message.channel.send(peckMemberEmbed);
			return;
		}
		if (mentionMember) {
			const peckMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is pecking **${mentionMember.user.username}**.`)
				.setImage(peckGif[Math.floor(Math.random() * peckGif.length)])
				.setFooter(`${mentionMember.user.username} has been pecked ${Got} times and pecked others ${Given} times.`);
			message.channel.send(peckMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you needa tell me who you wanna peck. Try again with `fox peck [user] (reason)`');
			return;
		}
	}
};
