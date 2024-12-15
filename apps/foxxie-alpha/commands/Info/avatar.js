// at the top of your file
const Discord = require('discord.js');

module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'av', 'usericon'],
	description: 'users avatar',
	usage: '(user)',
	guildOnly: false,
	execute(message, args) {

		let member = message.mentions.members.first() || message.member,
  user = member.user;

  const urlPNG = user.displayAvatarURL({ format: "png", dynamic: true, size: 512});
  const urlJPEG = user.displayAvatarURL({ format: "jpeg", dynamic: true, size: 512});
  const urlWEBP = user.displayAvatarURL({ format: "webp", dynamic: true, size: 512});

        const avatarEmbed = new Discord.MessageEmbed()
	.setColor('#EC8363')
	.setTitle(`${user.tag}`)
	.setDescription(`(**ID:** ${user.id})
	[PNG](${urlPNG}) | [JPEG](${urlJPEG}) | [WEBP](${urlWEBP})`)
	.setImage(urlPNG);
		message.reply(avatarEmbed);
	},
};