const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'setmessagechannel',
	aliases: ['lc', 'setmessage'],
	usage: 'setmessagechannel [#channel]',
	description: "Set's the message channel of the server. Type `none` if you want to disable the goodbye message entirely.",
	guildOnly: true,
	permission: 'ADMINISTRATOR',
	execute(client, message, args) {
		if (!args) return;
		if (args[0] === 'none' || args[0] === 'None') {
			db.delete(`Guilds_${message.guild.id}_Messagechannel`);
			message.react('✅');
			const removedEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`**Arighty,** removed the message logging channel and disabled message logs.`);

			return message.channel.send(removedEmbed).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
		if (!channel) {
			let msgchn = db.get(`Guilds_${message.guild.id}_Messagechannel`);
			if (msgchn === null) {
				const noEmbed = new Discord.MessageEmbed()
					.setColor(foxColor)
					.setDescription(`There is no message logging channel set right now. If you'd like to enable message logging use the command \`.mc [#channel]\``);

				return message.channel.send(noEmbed);
			}

			const sayEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`Right now the message logging channel is set to <#${msgchn}>. If you wanna change it to something else use \`.mc [#channel]\``);

			return message.channel.send(sayEmbed);
		}
		// adding channel to quick.db
		db.set(`Guilds_${message.guild.id}_Messagechannel`, channel.id);
		message.react('✅');

		const successEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setDescription(`**Alrighty,** set the message logging channel as ${channel} and enabled server message logging.`);

		message.channel.send(successEmbed).then(msg => {
			setTimeout(() => msg.delete(), 10000);
		});
	}
};
