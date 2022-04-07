const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const cryGif = [
	'https://i.imgur.com/lYe8gJ6.gif',
	'https://i.imgur.com/4tHzo2O.gif',
	'https://i.imgur.com/nkIKOh2.gif',
	'https://i.imgur.com/Wf8gg7b.gif',
	'https://i.imgur.com/Y8ewjVa.gif',
	'https://i.imgur.com/PO8eo1O.gif',
	'https://i.imgur.com/ckNkNtQ.gif',
	'https://i.imgur.com/aXu1fCE.gif',
	'https://i.imgur.com/lM3LDwS.gif',
	'https://i.imgur.com/mepi2mG.gif',
	'https://i.imgur.com/X76KwdW.gif',
	'https://i.imgur.com/tuMosdQ.gif',
	'https://i.imgur.com/XZAzy4s.gif',
	'https://i.imgur.com/Qaox2MI.gif',
	'https://i.imgur.com/zcAvpWy.gif',
	'https://i.imgur.com/5FVleDq.gif',
	'https://i.imgur.com/nDUmIx1.gif',
	'https://i.imgur.com/wIcdB3m.gif',
	'https://i.imgur.com/ZKQPRsr.gif'
];
module.exports = {
	name: 'cry',
	aliases: ['sob'],
	description: 'Cry at someone',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Crygiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Crygot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Crygiven}`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Crygot`) || '0';
		}

		const GivenAuth = db.get(`Users_${message.author.id}_Crygiven`) || '0';

		let cryText = args.slice(1).join(' ');
		if (mentionMember && cryText) {
			const cryMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is crying at **${mentionMember.user.username}**.\n"${cryText}"`)
				.setImage(cryGif[Math.floor(Math.random() * cryGif.length)])
				.setFooter(`${mentionMember.user.username} has been cried at ${Got} times and cried at others ${Given} times.`);
			message.channel.send(cryMemberEmbed);
			return;
		}
		if (mentionMember) {
			const cryMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is crying because of **${mentionMember.user.username}**.`)
				.setImage(cryGif[Math.floor(Math.random() * cryGif.length)])
				.setFooter(`${mentionMember.user.username} has been cried at ${Got} times and cried at others ${Given} times.`);
			message.channel.send(cryMemberEmbed);
			return;
		}
			const cryEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is crying.`)
				.setImage(cryGif[Math.floor(Math.random() * cryGif.length)])
				.setFooter(`${message.member.user.username} has cried ${GivenAuth} times.`);
			message.channel.send(cryEmbed);
			return;

	}
};
