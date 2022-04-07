const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const HFGif = [
	'https://i.imgur.com/Mp1qTBZ.gif',
	'https://i.imgur.com/l1lMpSb.gif',
	'https://i.imgur.com/1b2JJuI.gif',
	'https://i.imgur.com/RafOV3Z.gif',
	'https://i.imgur.com/Yighxmr.gif',
	'https://i.imgur.com/N6Uu3BK.gif',
	'https://i.imgur.com/NCLvwkP.gif',
	'https://i.imgur.com/wEhNsi5.gif',
	'https://i.imgur.com/i3GNxDx.gif',
	'https://i.imgur.com/n8vlaoQ.gif',
	'https://i.imgur.com/VYWpPMH.gif',
	'https://i.imgur.com/9IhYGbd.gif',
	'https://i.imgur.com/rzxzyN7.gif',
	'https://i.imgur.com/xC5TbqT.gif',
	'https://i.imgur.com/vAnNLKK.gif',
	'https://i.imgur.com/jlQKkdA.gif'
];
module.exports = {
	name: 'highfive',
	aliases: ['high-five'],
	description: 'Give someone a high five.',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Highfivegiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Highfivegot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Highfivegiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Highfivegot`) || '0';
		}

		let HFText = args.slice(1).join(' ');
		if (mentionMember && HFText) {
			const HFMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${mentionMember.user.username}** and **${message.member.user.username}** are highfiving.\n"${HFText}"`)
				.setImage(HFGif[Math.floor(Math.random() * HFGif.length)])
				.setFooter(`${mentionMember.user.username} has been highfived ${Got} times and highfived others ${Given} times.`);
			message.channel.send(HFMemberEmbed);
			return;
		}
		if (mentionMember) {
			const HFMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${mentionMember.user.username}** and **${message.member.user.username}** are highfiving.`)
				.setImage(HFGif[Math.floor(Math.random() * HFGif.length)])
				.setFooter(`${mentionMember.user.username} has been highfived ${Got} times and highfived others ${Given} times.`);
			message.channel.send(HFMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** who do you want to highfive? Try again with `fox highfive [user] (reason)`');
			return;
		}
	}
};
