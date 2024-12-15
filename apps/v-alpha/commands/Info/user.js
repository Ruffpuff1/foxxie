// at the top of your file
const Discord = require('discord.js');

module.exports = {
	name: 'user',
	aliases: ['self', 'userinfo', 'member', 'whois'],
	description: 'user',
	usage: '(user)',
	guildOnly: false,
	execute(message, args) {
		let member = message.mentions.members.first() || message.member,
  user = member.user;

		const created = new Date(user.createdTimestamp).toLocaleDateString();
		const joined = new Date(member.joinedTimestamp).toLocaleDateString();

		const timesincejoined = new Date(member.joinedTimestamp).toLocaleTimeString();
		const timesincecreated = new Date(user.createdTimestamp).toLocaleTimeString();



        const userEmbed = new Discord.MessageEmbed()
	.setColor('#EC8363')
	.setTitle(`${user.tag}`)
	.setDescription(`Here is some information about <@${user.id}>`)
	.setThumbnail(user.avatarURL())
	.addFields(
		{ name: ':id: User ID', value: `${user.id}` , inline: true },
		{ name: ':scroll: Number of Roles', value: member.roles.cache.size - 1 , inline: true },
		{ name: ':globe_with_meridians: Status', value: user.presence.status , inline: true },
	)
	.addField(`:robot: Bot`, `${user.bot}` , false)
	.addField(`:calendar: Joined ${message.guild.name}`, `${joined}\n**(${timesincejoined})**`, true)
    .addField(':calendar: Account Creation', `${created}\n**(${timesincecreated})**`, true)
		message.reply(userEmbed);
	},
};