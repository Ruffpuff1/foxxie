const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'av', 'usericon'],
	description: 'users avatar',
	usage: 'avater (user)',
	guildOnly: true,
	execute(client, message, args) {
		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		let isBot = member.id == '812546582531801118';
		let isDev = member.id == '486396074282450946';
		let isAmb = member.id == '379951803107901450';
		if (member) {
			console.log(member.id);
			const urlPNG = member.user.displayAvatarURL({
				format: 'png',
				dynamic: true,
				size: 512
			});
			const urlJPEG = member.user.displayAvatarURL({
				format: 'jpeg',
				dynamic: true,
				size: 512
			});
			const urlWEBP = member.user.displayAvatarURL({
				format: 'webp',
				dynamic: true,
				size: 512
			});

			const avatarEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setTitle(`${member.user.tag}`)
				.setDescription(`(**ID:** ${member.user.id})\n[PNG](${urlPNG}) | [JPEG](${urlJPEG}) | [WEBP](${urlWEBP})`)
				.setImage(urlPNG);

			if (isBot) {
				avatarEmbed.setDescription(
					`(**ID:** ${member.user.id})\n[PNG](${urlPNG}) | [JPEG](${urlJPEG}) | [WEBP](${urlWEBP})\n\n**Here is my cool avatar,\nthis is one currently a placeholder though.**`
				);
			}
			if (isAmb) {
				avatarEmbed.setDescription(
					`(**ID:** ${member.user.id})\n[PNG](${urlPNG}) | [JPEG](${urlJPEG}) | [WEBP](${urlWEBP})\n\n**This is Amber's Avatar,\nI'm sure by the time I've shown you she's\nchanged it again lmao.**`
				);
			}
			if (isDev) {
				avatarEmbed.setDescription(
					`(**ID:** ${member.user.id})\n[PNG](${urlPNG}) | [JPEG](${urlJPEG}) | [WEBP](${urlWEBP})\n\n**Here is the Avatar of my developer Ruffpuff isn't he handsome xD**`
				);
			}

			message.reply(avatarEmbed);
		}
	}
};
