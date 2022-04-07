const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const killGif = [
	'https://i.imgur.com/WJrfHMi.gif',
	'https://i.imgur.com/EUXODjM.gif',
	'https://i.imgur.com/REKXpeN.gif',
	'https://i.imgur.com/6zunk3V.gif',
	'https://i.imgur.com/ZYwajxm.gif',
	'https://i.imgur.com/IYWjCvE.gif',
	'https://i.imgur.com/OsCseaH.gif',
	'https://i.imgur.com/dARWLkZ.gif',
	'https://i.imgur.com/RLs8crk.gif',
	'https://i.imgur.com/zjLXWfx.gif',
	'https://i.imgur.com/WIMe2Gu.gif'
];
module.exports = {
	name: 'kill',
	aliases: ['murder', 'destroy'],
	description: 'Fucking kill someone.',
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Killgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Killgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Killgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Killgot`) || '0';
		}

		let killText = args.slice(1).join(' ');
		if (mentionMember && killText) {
			const killMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is murdering **${mentionMember.user.username}**.\n"${killText}"`)
				.setImage(killGif[Math.floor(Math.random() * killGif.length)])
				.setFooter(`${mentionMember.user.username} has been killed ${Got} times and killed others ${Given} times. (Should I be telling you this??)`);
			message.channel.send(killMemberEmbed);
			return;
		}
		if (mentionMember) {
			const killMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is murdering **${mentionMember.user.username}**.`)
				.setImage(killGif[Math.floor(Math.random() * killGif.length)])
				.setFooter(`${mentionMember.user.username} has been killed ${Got} times and killed others ${Given} times. (Should I be telling you this??)`);
			message.channel.send(killMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** if you *are* gonna kill someone, you gotta tell me who. Try again with `fox kill [user] (reason)`');
			return;
		}
	}
};
