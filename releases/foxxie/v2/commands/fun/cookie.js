const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'cookie',
	aliases: ['gibecookie', 'noms'],
	description: 'Give a cookie to your friends.',
	usage: 'cookie [user]',
	guildOnly: true,
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let cookieLink = 'https://i.imgur.com/wZjlZay.png';
		if (!mentionMember)
			return message.channel.send('Tell me who ya wanna give the cookie to.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		const cookieEmbed = new Discord.MessageEmbed()
			.setTitle(`**${message.member.user.username}** gives a cookie to ${mentionMember.user.username}.`)
			.setImage(cookieLink)
			.setColor(foxColor);

		message.channel.send(cookieEmbed);
	}
};
