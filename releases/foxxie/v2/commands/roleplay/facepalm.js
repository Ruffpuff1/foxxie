const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const facepalmGif = [
	'https://i.imgur.com/fAuP3ga.gif',
	'https://i.imgur.com/BksyRSa.gif',
	'https://i.imgur.com/GwcLPqL.gif',
	'https://i.imgur.com/LcgT5RK.gif',
	'https://i.imgur.com/q7Ph9Xy.gif',
	'https://i.imgur.com/VhGItz7.gif',
	'https://i.imgur.com/EbNztjI.gif',
	'https://i.imgur.com/BVERVj1.gif'
];
module.exports = {
	name: 'facepalm',
	aliases: ['dumb'],
	description: 'Facepalm... it explains itself',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Facepalmgiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Facepalmgot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Facepalmgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Facepalmgot`) || '0';
		}

		const GivenAuth = db.get(`Users_${message.author.id}_Facepalmgiven`) || '0';

		let facepalmText = args.slice(1).join(' ');
		if (mentionMember && facepalmText) {
			const facepalmMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is facepalming because of **${mentionMember.user.username}**.\n"${facepalmText}"`)
				.setImage(facepalmGif[Math.floor(Math.random() * facepalmGif.length)])
				.setFooter(`${mentionMember.user.username} has been facepalmed at ${Got} times and facepalmed at others ${Given} times.`);
			message.channel.send(facepalmMemberEmbed);
			return;
		}
		if (mentionMember) {
			const facepalmMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is facepalming because of **${mentionMember.user.username}**.`)
				.setImage(facepalmGif[Math.floor(Math.random() * facepalmGif.length)])
				.setFooter(`${mentionMember.user.username} has been facepalmed at ${Got} times and facepalmed at others ${Given} times.`);
			message.channel.send(facepalmMemberEmbed);
			return;
		}
			const facepalmEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is facepalming.`)
				.setImage(facepalmGif[Math.floor(Math.random() * facepalmGif.length)])
				.setFooter(`${message.member.user.username} has facepalmed ${GivenAuth} times.`);
			message.channel.send(facepalmEmbed);
	}
};
