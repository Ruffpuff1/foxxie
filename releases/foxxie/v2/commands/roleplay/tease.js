const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
const teaseGif = [
	'https://i.imgur.com/o79Eqpa.gif',
	'https://i.imgur.com/a0YaLwk.gif',
	'https://i.imgur.com/EJLJGSW.gif',
	'https://i.imgur.com/ngJtczx.gif',
	'https://i.imgur.com/9AqHztL.gif',
	'https://i.imgur.com/e1U9kPS.gif',
	'https://i.imgur.com/aji70Bc.gif',
	'https://i.imgur.com/YXNBNVk.gif',
	'https://i.imgur.com/DMnRYry.gif'
];
module.exports = {
	name: 'tease',
	description: "Tease someone a bit. I'm sure they'll like it",
	usage: '(user) (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		db.add(`Users_${message.author.id}_Teasegiven`, 1);
		if (mentionMember) {
			db.add(`Users_${mentionMember.user.id}_Teasegot`, 1);

			Given = db.get(`Users_${mentionMember.user.id}_Teasegiven`) || '0';
			Got = db.get(`Users_${mentionMember.user.id}_Teasegot`) || '0';
		}

		const GivenAuth = db.get(`Users_${message.author.id}_Teasegiven`) || '0';

		let teaseText = args.slice(1).join(' ');
		if (mentionMember && teaseText) {
			const teaseMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is teasing **${mentionMember.user.username}**.\n"${teaseText}"`)
				.setImage(teaseGif[Math.floor(Math.random() * teaseGif.length)])
				.setFooter(`${mentionMember.user.username} has been teased ${Got} times and teased others ${Given} times.`);
			message.channel.send(teaseMemberEmbed);
			return;
		}
		if (mentionMember) {
			const teaseMemberEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is teasing **${mentionMember.user.username}**.`)
				.setImage(teaseGif[Math.floor(Math.random() * teaseGif.length)])
				.setFooter(`${mentionMember.user.username} has been teased ${Got} times and teased others ${Given} times.`);
			message.channel.send(teaseMemberEmbed);
			return;
		}
			const teaseEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**${message.member.user.username}** is teasing.`)
				.setImage(teaseGif[Math.floor(Math.random() * teaseGif.length)])
				.setFooter(`${message.member.user.username} has teased ${GivenAuth} times.`);
			message.channel.send(teaseEmbed);
			return;
	}
};
