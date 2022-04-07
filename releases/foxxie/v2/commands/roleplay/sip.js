const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const sipGif = [
	'https://i.imgur.com/8pU3NcV.gif',
	'https://i.imgur.com/1APMQ00.gif',
	'https://i.imgur.com/8SqWGsS.gif',
	'https://i.imgur.com/mz8CkMW.gif',
	'https://i.imgur.com/RxIR3Gu.gif',
	'https://i.imgur.com/fa9H0Jo.gif',
	'https://i.imgur.com/5fvoz52.gif',
	'https://i.imgur.com/bSiI5y6.gif',
	'https://i.imgur.com/JEYgr0N.gif',
	'https://i.imgur.com/aQQmsqp.gif',
	'https://i.imgur.com/xMKUCBe.gif',
	'https://i.imgur.com/xQ2taeQ.gif',
	'https://i.imgur.com/V2KVLPa.gif'
];
module.exports = {
	name: 'sip',
	description: 'Sip some juice as you stare at idiots in chat',
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Sipgiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Sipgot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Sipgiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Sipgot`) || '0';
		}

		const GivenAuth = db.get(`Users_${message.author.id}_Sipgiven`) || '0';

		let sipText = args.slice(1).join(' ');
		if (mentionMember && sipText) {
			const sipMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** takes a sip with **${mentionMember.user.username}**.\n"${sipText}"`)
				.setImage(sipGif[Math.floor(Math.random() * sipGif.length)])
				.setFooter(`${mentionMember.user.username} has been sipped with ${Got} times and sipped with others ${Given} times.`);
			message.channel.send(sipMemberEmbed);
			return;
		}
		if (mentionMember) {
			const sipMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** takes a sip with **${mentionMember.user.username}**.`)
				.setImage(sipGif[Math.floor(Math.random() * sipGif.length)])
				.setFooter(`${mentionMember.user.username} has been sipped with ${Got} times and sipped with others ${Given} times.`);
			message.channel.send(sipMemberEmbed);
			return;
		}
			const sipEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** took a passive aggressive sip.`)
				.setImage(sipGif[Math.floor(Math.random() * sipGif.length)])
				.setFooter(`${message.member.user.username} has sipped ${GivenAuth} times.`);
			message.channel.send(sipEmbed);
			return;
	}
};
