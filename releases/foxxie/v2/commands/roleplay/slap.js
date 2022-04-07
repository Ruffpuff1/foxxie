const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const slapGif = [
	'https://i.imgur.com/biD7Bre.gif',
	'https://i.imgur.com/FRTGtqw.gif',
	'https://i.imgur.com/uNBz0PL.gif',
	'https://i.imgur.com/4lF8baw.gif',
	'https://i.imgur.com/ntL2UD8.gif',
	'https://i.imgur.com/MKeBH1O.gif',
	'https://i.imgur.com/Y7iP6dm.gif',
	'https://i.imgur.com/jhcT7m3.gif',
	'https://i.imgur.com/h48nGot.gif',
	'https://i.imgur.com/EvQyTLj.gif',
	'https://i.imgur.com/bSTxujW.gif',
	'https://i.imgur.com/1QO2Izb.gif',
	'https://i.imgur.com/3jTZ6Xv.gif'
];
module.exports = {
	name: 'slap',
	aliases: ['punch'],
	description: 'Slap someone in the face',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Slapgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Slapgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Slapgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Slapgot`) || '0';
		}

		let slapText = args.slice(1).join(' ');
		if (mentionMember && slapText) {
			const slapMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** slaps **${mentionMember.user.username}**.\n"${slapText}"`)
				.setImage(slapGif[Math.floor(Math.random() * slapGif.length)])
				.setFooter(`${mentionMember.user.username} has been slapped ${Got} times and slapped others ${Given} times.`);
			message.channel.send(slapMemberEmbed);
			return;
		}
		if (mentionMember) {
			const slapMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** slaps **${mentionMember.user.username}**.`)
				.setImage(slapGif[Math.floor(Math.random() * slapGif.length)])
				.setFooter(`${mentionMember.user.username} has been slapped ${Got} times and slapped others ${Given} times.`);
			message.channel.send(slapMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you needa tell me who you wanna slap. Try again with `fox slap [user] (reason)`');
			return;
		}
	}
};
