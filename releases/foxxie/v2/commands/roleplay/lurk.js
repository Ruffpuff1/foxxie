const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const lurkGif = [
	'https://i.imgur.com/C3hB1uN.gif',
	'https://i.imgur.com/aMnbaiI.gif',
	'https://i.imgur.com/MHSvME7.gif',
	'https://i.imgur.com/p3cdAz3.gif',
	'https://i.imgur.com/yp3ESgN.gif',
	'https://i.imgur.com/fCzJotn.gif',
	'https://i.imgur.com/qwQBdZo.gif',
	'https://i.imgur.com/mN78SRQ.gif'
];
module.exports = {
	name: 'lurk',
	aliases: ['hide'],
	description: 'Totally not creepily stare at someone',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Lurkgiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Lurkgot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Lurkgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Lurkgot`) || '0';
		}

		GivenAuth = db.get(`Users_${message.author.id}_Lurkgiven`) || '0';

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
				.setDescription(`**${message.member.user.username}** is lurking.`)
				.setImage(lurkGif[Math.floor(Math.random() * lurkGif.length)])
				.setFooter(`${message.member.user.username} has stared ${GivenAuth} times.`);
			message.channel.send(lurkEmbed);
			return;
		}
	}
};
