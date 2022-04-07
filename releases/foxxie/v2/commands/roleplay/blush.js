const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const Gif = [
	'https://i.imgur.com/vQE9CIT.gif',
	'https://i.imgur.com/FblRY6m.gif',
	'https://i.imgur.com/EJJvTDH.gif',
	'https://i.imgur.com/jFnTX2A.gif',
	'https://i.imgur.com/8WmGDwU.gif',
	'https://i.imgur.com/Pl1Gvpv.gif',
	'https://i.imgur.com/FpwIoWF.gif',
	'https://i.imgur.com/dfutA9H.gif',
	'https://i.imgur.com/3yyFl68.gif',
	'https://i.imgur.com/KNPSoTq.gif',
	'https://i.imgur.com/nkjhbpo.gif',
	'https://i.imgur.com/R7wGRSf.gif',
	'https://i.imgur.com/zeaimEd.gif',
	'https://i.imgur.com/CHpXuRN.gif',
	'https://i.imgur.com/Ilnj6DB.gif'
];
module.exports = {
	name: 'blush',
	description: 'Blush at someone.',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Blushgiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Blushgot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Blushgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Blushgot`) || '0';
		}

		GivenAuth = db.get(`Users_${message.author.id}_Blushgiven`) || '0';

		let Text = args.slice(1).join(' ');
		if (mentionMember && Text) {
			const MemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is blushing at **${mentionMember.user.username}**.\n"${Text}"`)
				.setImage(Gif[Math.floor(Math.random() * Gif.length)])
				.setFooter(`${mentionMember.user.username} has been blushed at ${Got} times and blushed at others ${Given} times.`);
			message.channel.send(MemberEmbed);
			return;
		}
		if (mentionMember) {
			const MemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** turned red because of **${mentionMember.user.username}**.`)
				.setImage(Gif[Math.floor(Math.random() * Gif.length)])
				.setFooter(`${mentionMember.user.username} has been blushed at ${Got} times and blushed at others ${Given} times.`);
			message.channel.send(MemberEmbed);
			return;
		}
		if (!mentionMember) {
			const Embed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is blushing.`)
				.setImage(Gif[Math.floor(Math.random() * Gif.length)])
				.setFooter(`${message.member.user.username} has blushed ${GivenAuth} times.`);
			message.channel.send(Embed);
			return;
		}
	}
};
