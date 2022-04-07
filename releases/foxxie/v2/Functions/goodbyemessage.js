const Discord = require('discord.js');
const db = require('quick.db');
const foxColor = require('../config.json');
module.exports = client => {
	client.on('guildMemberRemove', member => {
		console.log(member);
		let byechn = db.get(`Guilds_${member.guild.id}_Byechannel`);
		if (byechn === null) {
			return;
		}
		const goodbyeEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setAuthor(`${member.user.tag}`, `${member.user.avatarURL()}`)
			.setDescription(`Has left **The Corner Store**\nGoodbye **${member.user.tag}** :(`)
			.setFooter(
				`We now have ${client.users.cache.size - 1} members`,
				`https://cdn.discordapp.com/icons/761512748898844702/a_1d16f4a709969730e84c0b4baaa12ff8.webp`
			);
		if (member.guild.id == 761512748898844702) {
			return client.channels.cache
				.get(byechn)
				.send(goodbyeEmbed)
				.then(msg => {
					setTimeout(() => msg.delete(), 60000);
				});
		}

		client.channels.cache.get(byechn).send(`**<@${member.id}>** has left the server :(`);
	});
};
