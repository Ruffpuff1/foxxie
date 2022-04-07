const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const dabGif = ['https://i.imgur.com/8QXzsQF.gif', 'https://i.imgur.com/2w9pEkh.gif', 'https://i.imgur.com/KuWyTVo.gif', 'https://i.imgur.com/8g5cFJ8.gif'];
module.exports = {
	name: 'dab',
	description: 'Dab on them haters.',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Dabgiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Dabgot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Dabgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Dabgot`) || '0';
		}

		const GivenAuth = db.get(`Users_${message.author.id}_Dabgiven`) || '0';

		let dabText = args.slice(1).join(' ');
		if (mentionMember && dabText) {
			const dabMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is dabbing at **${mentionMember.user.username}**.\n"${dabText}"`)
				.setImage(dabGif[Math.floor(Math.random() * dabGif.length)])
				.setFooter(`${mentionMember.user.username} has been dabbed at ${Got} times and dabbed at others ${Given} times.`);
			message.channel.send(dabMemberEmbed);
			return;
		}
		if (mentionMember) {
			const dabMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is dabbing at **${mentionMember.user.username}**.`)
				.setImage(dabGif[Math.floor(Math.random() * dabGif.length)])
				.setFooter(`${mentionMember.user.username} has been dabbed at ${Got} times and dabbed at others ${Given} times.`);
			message.channel.send(dabMemberEmbed);
			return;
		}
			const dabEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is dabbing.`)
				.setImage(dabGif[Math.floor(Math.random() * dabGif.length)])
				.setFooter(`${message.member.user.username} has dabbed ${GivenAuth} times.`);
			message.channel.send(dabEmbed);
			return;

	}
};
