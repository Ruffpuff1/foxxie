const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const panicGif = [
	'https://i.imgur.com/Gkkhrl7.gif',
	'https://i.imgur.com/Cr0H3eh.gifv',
	'https://i.imgur.com/9eE9Jkf.gif',
	'https://i.imgur.com/bV5Wkj0.gif',
	'https://i.imgur.com/FDDnsnL.gif',
	'https://i.imgur.com/ZMwDO83.gif',
	'https://i.imgur.com/DrWtfiL.gif',
	'https://i.imgur.com/BBQmnMX.gif',
	'https://i.imgur.com/as8cgeW.gif',
	'https://i.imgur.com/A4GRXXb.gif',
	'https://i.imgur.com/GhKCtsF.gif',
	'https://i.imgur.com/X60F7bq.gif'
];
module.exports = {
	name: 'panic',
	description: 'Have a panic attack',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Panicgiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Panicgot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Panicgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Panicgot`) || '0';
		}

		GivenAuth = db.get(`Users_${message.author.id}_Panicgiven`) || '0';

		let panicText = args.slice(1).join(' ');
		if (mentionMember && panicText) {
			const panicMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is panicking because of **${mentionMember.user.username}**.\n"${panicText}"`)
				.setImage(panicGif[Math.floor(Math.random() * panicGif.length)])
				.setFooter(`${mentionMember.user.username} has panicked ${Got} times and panicked because of others ${Given} times.`);
			message.channel.send(panicMemberEmbed);
			return;
		}
		if (mentionMember) {
			const panicMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is panicking because of **${mentionMember.user.username}**.`)
				.setImage(panicGif[Math.floor(Math.random() * panicGif.length)])
				.setFooter(`${mentionMember.user.username} has panicked ${Got} times and panicked because of others ${Given} times.`);
			message.channel.send(panicMemberEmbed);
			return;
		}
		if (!mentionMember) {
			const panicEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is panicking.`)
				.setImage(panicGif[Math.floor(Math.random() * panicGif.length)])
				.setFooter(`${message.member.user.username} has panicked ${GivenAuth} times.`);
			message.channel.send(panicEmbed);
			return;
		}
	}
};
