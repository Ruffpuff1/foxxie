const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const waveGif = [
	'https://i.imgur.com/STAAgQf.gif',
	'https://i.imgur.com/gBIsBMf.gif',
	'https://i.imgur.com/3B4kiJ3.gif',
	'https://i.imgur.com/ZBFHktK.gif',
	'https://i.imgur.com/pDyW4N2.gif',
	'https://i.imgur.com/QPv77vK.gif',
	'https://i.imgur.com/7qili94.gif',
	'https://i.imgur.com/nxSXCQM.gif',
	'https://i.imgur.com/30ACMRN.gif',
	'https://i.imgur.com/tkGh379.gif',
	'https://i.imgur.com/WC4UXGr.gif',
	'https://i.imgur.com/OH3AN3S.gif',
	'https://i.imgur.com/8zHC05E.gif',
	'https://i.imgur.com/XWh9nqH.gif'
];
module.exports = {
	name: 'wave',
	aliases: ['hello', 'greet', 'bye', 'goodbye', 'hi', 'hey'],
	description: 'Wave at someone',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Wavegiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Wavegot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Wavegiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Wavegot`) || '0';
		}

		const GivenAuth = db.get(`Users_${message.author.id}_Wavegiven`) || '0';

		let waveText = args.slice(1).join(' ');
		if (mentionMember && waveText) {
			const waveMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is waving at **${mentionMember.user.username}**.\n"${waveText}"`)
				.setImage(waveGif[Math.floor(Math.random() * waveGif.length)])
				.setFooter(`${mentionMember.user.username} has been waved at ${Got} times and waved at others ${Given} times.`);
			message.channel.send(waveMemberEmbed);
			return;
		}
		if (mentionMember) {
			const waveMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is waving at **${mentionMember.user.username}**.`)
				.setImage(waveGif[Math.floor(Math.random() * waveGif.length)])
				.setFooter(`${mentionMember.user.username} has been waved at ${Got} times and waved at others ${Given} times.`);
			message.channel.send(waveMemberEmbed);
			return;
		}
			const waveEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is waving.`)
				.setImage(waveGif[Math.floor(Math.random() * waveGif.length)])
				.setFooter(`${message.member.user.username} has waved ${GivenAuth} times.`);
			message.channel.send(waveEmbed);
			return;
	}
};
