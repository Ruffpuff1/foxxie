const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'setwelcomechannel',
	aliases: ['setwelchannel', 'wc'],
	usage: 'setwelcomechannel [#channel]',
	description: 'Set the welcome channel of the server',
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	execute(client, message, args) {
		if (args[0] === 'none') {
			db.delete(`Guilds_${message.guild.id}_Welchannel`);
			message.react('✅');

			const removedEmbed = new Discord.MessageEmbed().setColor(foxColor).setDescription(`**Arighty,** removed the welcome channel and disabled welcome messages.`);

			return message.channel.send(removedEmbed).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]); //mentioned channel
		if (!channel) {
			let welchn = db.get(`Guilds_${message.guild.id}_Welchannel`);
			if (welchn === null) {
				const noEmbed = new Discord.MessageEmbed()
					.setColor(foxColor)
					.setDescription(`There is no welcome channel set right now. If you'd like to enable welcome messages use the command \`.wc [#channel]\``);

				return message.channel.send(noEmbed);
			}

			const sayEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`Right now the welcome channel is set to <#${welchn}>. If you wanna change it to something else use \`.wc [#channel]\``);

			return message.channel.send(sayEmbed);
		}
		//Now we gonna use quick.db
		db.set(`Guilds_${message.guild.id}_Welchannel`, channel.id);
		message.react('✅');

		const successEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setDescription(`**Alrighty,** set the welcome channel as ${channel} and enabled welcome messages.`);

		message.channel.send(successEmbed).then(msg => {
			setTimeout(() => msg.delete(), 5000);
		});
	}
};
