const db = require('quick.db');
const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'setgoodbyechannel',
	aliases: ['setbye', 'byechn', 'gc'],
	usage: 'setgoodbyechannel[#channel]',
	description: "Set's the goodbye channel of the server. Type `none` if you want to disable the goodbye message entirely.",
	guildOnly: true,
	permission: 'ADMINISTRATOR',
	execute(client, message, args) {
		if (args[0] === 'none' || args[0] === 'None') {
			db.delete(`Guilds_${message.guild.id}_Byechannel`);
			message.react(`✅`);

			const removedEmbed = new Discord.MessageEmbed().setColor(foxColor).setDescription(`**Arighty,** removed the goodbye channel and disabled goodbye messages.`);
			return message.channel.send(removedEmbed).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]); // mentioned channel ez
		if (!channel) {
			let byechn = db.get(`Guilds_${message.guild.id}_Byechannel`);
			if (byechn === null) {
				const noEmbed = new Discord.MessageEmbed()
					.setColor(foxColor)
					.setDescription(`There is no goodbye channel set right now. If you'd like to enable goodbye message use the command \`.gc [#channel]\``);

				return message.channel.send(noEmbed);
			}

			const sayEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`Right now the goodbye channel is set to <#${byechn}>. If you wanna change it to something else use \`.gc [#channel]\``);

			return message.channel.send(sayEmbed);
		}
		// adding channel to quick.db
		db.set(`Guilds_${message.guild.id}_Byechannel`, channel.id);
		message.react('✅');

		const successEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setDescription(`**Alrighty,** set the goodbye channel as ${channel} and enabled goodbye messages.`);

		message.channel.send(successEmbed).then(msg => {
			setTimeout(() => msg.delete(), 10000);
		});
	}
};
