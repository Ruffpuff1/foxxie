const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const stabGif = [
	'https://i.imgur.com/HnWWFpX.gif',
	'https://i.imgur.com/r6zC5q0.gif',
	'https://i.imgur.com/lctXp9t.gif',
	'https://i.imgur.com/9sWVfmz.gif',
	'https://i.imgur.com/aDpz3Bc.gif',
	'https://i.imgur.com/icpfMmn.gif',
	'https://i.imgur.com/kplZUtx.gif',
	'https://i.imgur.com/wddsPVe.gif',
	'https://i.imgur.com/ltLAZ1r.gif',
	'https://i.imgur.com/TLnwR4U.gif',
	'https://i.imgur.com/8dxZ74U.gif',
	'https://i.imgur.com/EMgDBTj.gif',
	'https://i.imgur.com/tptGHGa.gif',
	'https://i.imgur.com/puev8T3.gif',
	'https://i.imgur.com/LMqBHSQ.gif',
	'https://i.imgur.com/f4R5AZR.gif'
];
module.exports = {
	name: 'stab',
	aliases: ['knife', 'shank'],
	description: "Slide a knife neatly between someone's ribs.",
	usage: '[user] (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (mentionMember) {
			db.add(`Users_${message.author.id}_Stabgiven`, 1);
			db.add(`Users_${mentionMember.user.id}_Stabgot`, 1);
			Given = db.get(`Users_${mentionMember.user.id}_Stabgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Stabgot`) || '0';
		}

		let stabText = args.slice(1).join(' ');
		if (mentionMember && stabText) {
			const stabMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is slicing up **${mentionMember.user.username}**.\n"${stabText}"`)
				.setImage(stabGif[Math.floor(Math.random() * stabGif.length)])
				.setFooter(`${mentionMember.user.username} has been stabbed ${Got} times and stabbed others ${Given} times.`);
			message.channel.send(stabMemberEmbed);
			return;
		}
		if (mentionMember) {
			const stabMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is slicing up **${mentionMember.user.username}**.`)
				.setImage(stabGif[Math.floor(Math.random() * stabGif.length)])
				.setFooter(`${mentionMember.user.username} has been stabbed ${Got} times and stabbed others ${Given} times.`);
			message.channel.send(stabMemberEmbed);
			return;
		}
		if (!mentionMember) {
			message.channel.send('**Hey** if you *are* gonna stab someone, you gotta tell me who. Try again with `fox stab [user] (reason)`');
			return;
		}
	}
};
