const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'setlogchannel',
	aliases: ['setmodchannel', 'mc'],
	usage: 'setlogchannel [#channel]',
	description: 'Set the mod log channel of the server',
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	execute(client, message, args) {
		if (args[0] === 'none') {
			db.delete(`Guilds_${message.guild.id}_Logchannel`);
			message.react('✅');
			const removedEmbed = new Discord.MessageEmbed().setColor(foxColor).setDescription(`**Arighty,** removed the modlog channel and disabled moderation logs.`);

			return message.channel.send(removedEmbed).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]); //mentioned channel
		if (!channel) {
			let logchn = db.get(`Guilds_${message.member.guild.id}_Logchannel`);
			if (logchn === null) {
				const noEmbed = new Discord.MessageEmbed()
					.setColor(foxColor)
					.setDescription(`There is no modlog channel set right now. If you'd like to enable moderation logging use the command \`.mc [#channel]\``);

				return message.channel.send(noEmbed);
			}

			const sayEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`Right now the modlogs channel is set to <#${logchn}>. If you wanna change it to something else use \`.mc [#channel]\``);

			return message.channel.send(sayEmbed);
		}
		//Now we gonna use quick.db
		db.set(`Guilds_${message.guild.id}_Logchannel`, channel.id); //set id in var
		message.react('✅');

		const successEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setDescription(`**Alrighty,** set the modlog channel as ${channel} and enabled moderation logging.`);

		message.channel.send(successEmbed).then(msg => {
			setTimeout(() => msg.delete(), 10000);
		});
	}
};
