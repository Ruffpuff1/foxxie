const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const nomGif = [
	'https://i.imgur.com/YcIKMYx.gif',
	'https://i.imgur.com/KuQnqR3.gif',
	'https://i.imgur.com/kDSOeMl.gif',
	'https://i.imgur.com/35zHAMh.gif',
	'https://i.imgur.com/KfDowSe.gif',
	'https://i.imgur.com/biSEbaa.gif',
	'https://i.imgur.com/PJNuGgN.gif',
	'https://i.imgur.com/xA2MTk3.gif',
	'https://i.imgur.com/NIAgFql.gif',
	'https://i.imgur.com/kFMkzMQ.gif',
	'https://i.imgur.com/naGTeHL.gif',
	'https://i.imgur.com/5gxxj8d.gif'
];
module.exports = {
	name: 'nom',
	description: 'Give someone a nom',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Nomgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Nomgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Nomgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Nomgot`) || '0';
		}

		let nomText = args.slice(1).join(' ');
		if (mentionMember && nomText) {
			const nomMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** nommed on **${mentionMember.user.username}**.\n"${nomText}"`)
				.setImage(nomGif[Math.floor(Math.random() * nomGif.length)])
				.setFooter(`${mentionMember.user.username} has been nommed ${Got} times and nommed on others ${Given} times.`);
			message.channel.send(nomMemberEmbed);
			return;
		}
		if (mentionMember) {
			const nomMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** nommed on **${mentionMember.user.username}**.`)
				.setImage(nomGif[Math.floor(Math.random() * nomGif.length)])
				.setFooter(`${mentionMember.user.username} has been nommed ${Got} times and nommed on others ${Given} times.`);
			message.channel.send(nomMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you needa tell me who ya wanna nom on. Try again with `fox nom [user] (reason)`');
			return;
		}
	}
};
