const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
const db = require('quick.db');
module.exports = {
	name: 'testleave',
	aliases: ['testbye', 'testgoodbye', 'tl'],
	description: 'Testing goodbye embed',
	usage: 'testleave (user)',
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	execute(client, message, args) {
		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		let byechn = db.get(`Guilds_${member.guild.id}_Byechannel`);
		if (byechn === null) {
			return;
		}
		message.delete();
		const byeChannel = message.guild.channels.cache.get(byechn);
		const testGoodbyeEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setAuthor(`${member.user.tag}`, `${member.user.avatarURL()}`)
			.setDescription(`Has left **${message.guild.name}**\nGoodbye **${member.user.tag}** :(`)
			.setFooter(`We now have ${message.guild.memberCount} members`, `${message.guild.iconURL()}`);
		if (member.guild.id == 761512748898844702) {
			return byeChannel.send(testGoodbyeEmbed).then(msg => {
				setTimeout(() => msg.delete(), 60000);
			});
		}

		byeChannel.send(`**<@${member.id}>** has left the server :(`);
	}
};
