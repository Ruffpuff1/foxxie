const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const kissGif = [
	'https://i.imgur.com/1Np7gPp.gif',
	'https://i.imgur.com/R8iJ6SU.gif',
	'https://i.imgur.com/6nJ4833.gif',
	'https://i.imgur.com/soLPPuj.gif',
	'https://i.imgur.com/agiCqaM.gif',
	'https://i.imgur.com/RMwiiIW.gif',
	'https://i.imgur.com/4sdP0Qw.gif',
	'https://i.imgur.com/8iVArG4.gif',
	'https://i.imgur.com/V9MV8yd.gif',
	'https://i.imgur.com/F5qikUg.gif',
	'https://i.imgur.com/ywQ0BT1.gif',
	'https://i.imgur.com/hApMRTp.gif',
	'https://i.imgur.com/8WQyvRX.gif',
	'https://i.imgur.com/6HCJNH6.gif',
	'https://i.imgur.com/fB0ZH8A.gif',
	'https://i.imgur.com/JxECaaE.gif',
	'https://i.imgur.com/EaZXvoh.gif'
];
module.exports = {
	name: 'kiss',
	aliases: ['smooch'],
	description: 'Give someone a big kiss',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Kissgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Kissgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Kissgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Kissgot`) || '0';
		}

		let kissText = args.slice(1).join(' ');
		if (mentionMember && kissText) {
			const kissMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is kissing **${mentionMember.user.username}**.\n"${kissText}"`)
				.setImage(kissGif[Math.floor(Math.random() * kissGif.length)])
				.setFooter(`${mentionMember.user.username} has been kissed ${Got} times and kissed others ${Given} times.`);
			message.channel.send(kissMemberEmbed);
			return;
		}
		if (mentionMember) {
			const kissMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is kissing **${mentionMember.user.username}**.`)
				.setImage(kissGif[Math.floor(Math.random() * kissGif.length)])
				.setFooter(`${mentionMember.user.username} has been kissed ${Got} times and kissed others ${Given} times.`);
			message.channel.send(kissMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you needa tell me who you wanna kiss. Try again with `fox kiss [user] (reason)`');
			return;
		}
	}
};
