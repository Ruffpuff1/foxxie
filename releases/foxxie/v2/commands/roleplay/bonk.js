const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const bonkGif = [
	'https://i.imgur.com/NfxFnp5.gif',
	'https://i.imgur.com/6pGcu5D.gif',
	'https://i.imgur.com/Ei1GWPW.gif',
	'https://i.imgur.com/4V4Pgxf.gif',
	'https://i.imgur.com/EzTL72w.gif',
	'https://i.imgur.com/Zw2g00J.gif',
	'https://i.imgur.com/aS5nkme.gif',
	'https://i.imgur.com/yyGo4gL.gif',
	'https://i.imgur.com/HSnpi17.gif',
	'https://i.imgur.com/eQ1Btsv.gif',
	'https://i.imgur.com/GcS5eTN.gif',
	'https://i.imgur.com/J9Lkt8F.gif',
	'https://i.imgur.com/4yPoQVF.gif'
];
module.exports = {
	name: 'bonk',
	aliases: ['bop'],
	description: 'Hit someone on their head.',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Bonkgot`, 1);
			db.add(`Users_${message.author.id}_Bonkgiven`, 1);
			bonkGiven = db.get(`Users_${mentionMember.user.id}_Bonkgiven`) || '0';
			bonkGot = db.get(`Users_${mentionMember.user.id}_Bonkgot`) || '0';
		}

		let bonkText = args.slice(1).join(' ');

		if (mentionMember && bonkText) {
			const bonkMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${mentionMember.user.username}** got their head bonked by **${message.member.user.username}**.\n"${bonkText}"`)
				.setImage(bonkGif[Math.floor(Math.random() * bonkGif.length)])
				.setFooter(`${mentionMember.user.username} has been bonked ${bonkGot} times and bonked others ${bonkGiven} times.`);
			message.channel.send(bonkMemberEmbed);
			return;
		}
		if (mentionMember) {
			const bonkMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${mentionMember.user.username}** got their head bonked by **${message.member.user.username}**.`)
				.setImage(bonkGif[Math.floor(Math.random() * bonkGif.length)])
				.setFooter(`${mentionMember.user.username} has been bonked ${bonkGot} times and bonked others ${bonkGiven} times.`);
			message.channel.send(bonkMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you gotta tell me who you wanna hit on the head. Try again with `fox bonk [user] (reason)`');
			return;
		}
	}
};
