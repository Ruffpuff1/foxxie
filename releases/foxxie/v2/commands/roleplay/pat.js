const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const patGif = [
	'https://i.imgur.com/sRXuiNz.gif',
	'https://i.imgur.com/ZQ7nps4.gif',
	'https://i.imgur.com/fDjsIFV.gif',
	'https://i.imgur.com/2wmbIlL.gif',
	'https://i.imgur.com/oZp81rf.gif',
	'https://i.imgur.com/8qaaK6Q.gif',
	'https://i.imgur.com/R3DH6X0.gif',
	'https://i.imgur.com/xgrK5Ww.gif',
	'https://i.imgur.com/AfK7URp.gif',
	'https://i.imgur.com/2AwAqbP.gif',
	'https://i.imgur.com/Vz9EdZS.gif',
	'https://i.imgur.com/8Y672HC.gif',
	'https://i.imgur.com/xbzQ70N.gif',
	'https://i.imgur.com/Sr7rXzX.gif',
	'https://i.imgur.com/3E1HVDl.gif',
	'https://i.imgur.com/fyyoszk.gif',
	'https://i.imgur.com/0YxfUdB.gif',
	'https://i.imgur.com/WguvZ6V.gif'
];
module.exports = {
	name: 'pat',
	aliases: ['headpat'],
	description: 'Give someone headpats',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Patgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Patgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Patgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Patgot`) || '0';
		}

		let patText = args.slice(1).join(' ');
		if (mentionMember && patText) {
			const patMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is patting **${mentionMember.user.username}**.\n"${patText}"`)
				.setImage(patGif[Math.floor(Math.random() * patGif.length)])
				.setFooter(`${mentionMember.user.username} has been pat ${Got} times and pat others ${Given} times.`);
			message.channel.send(patMemberEmbed);
			return;
		}
		if (mentionMember) {
			const patMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is patting **${mentionMember.user.username}**.`)
				.setImage(patGif[Math.floor(Math.random() * patGif.length)])
				.setFooter(`${mentionMember.user.username} has been pat ${Got} times and pat others ${Given} times.`);
			message.channel.send(patMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** you needa tell me who ya wanna give pats to. Try again with `fox pat [user] (reason)`');
			return;
		}
	}
};
