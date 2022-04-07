const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const lurkGif = [
	'https://i.imgur.com/IG9V8KS.gif',
	'https://i.imgur.com/d6608xq.gif',
	'https://i.imgur.com/htYnfhx.gif',
	'https://i.imgur.com/Qt9uiNS.gif',
	'https://i.imgur.com/Yv97jaD.gif',
	'https://i.imgur.com/D6Qm5cd.gif',
	'https://i.imgur.com/K0oAeOO.gif',
	'https://i.imgur.com/bkOxHOG.gif',
	'https://i.imgur.com/UVLF2Ug.gif',
	'https://i.imgur.com/nVnEsD1.gif',
	'https://i.imgur.com/mRi3QqM.gif',
	'https://i.imgur.com/Tb6nf3a.gif'
];
module.exports = {
	name: 'stare',
	aliases: ['glance'],
	description: 'Look at someone weirdly',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Staregiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Staregot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Staregiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Staregot`) || '0';
		}

		GivenAuth = db.get(`Users_${message.author.id}_Staregiven`) || '0';

		let lurkText = args.slice(1).join(' ');
		if (mentionMember && lurkText) {
			const lurkMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is staring at **${mentionMember.user.username}**.\n"${lurkText}"`)
				.setImage(lurkGif[Math.floor(Math.random() * lurkGif.length)])
				.setFooter(`${mentionMember.user.username} has been stared at ${Got} times and stared at others ${Given} times.`);
			message.channel.send(lurkMemberEmbed);
			return;
		}
		if (mentionMember) {
			const lurkMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is staring at **${mentionMember.user.username}**.`)
				.setImage(lurkGif[Math.floor(Math.random() * lurkGif.length)])
				.setFooter(`${mentionMember.user.username} has been stared at ${Got} times and stared at others ${Given} times.`);
			message.channel.send(lurkMemberEmbed);
			return;
		}
		if (!mentionMember) {
			const lurkEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is staring.`)
				.setImage(lurkGif[Math.floor(Math.random() * lurkGif.length)])
				.setFooter(`${message.member.user.username} has stared ${GivenAuth} times.`);
			message.channel.send(lurkEmbed);
			return;
		}
	}
};
