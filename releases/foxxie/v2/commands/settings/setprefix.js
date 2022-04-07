const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'setprefix',
	aliases: ['sp'],
	usage: 'setprefix [prefix]',
	description: "Set the server's custom prefix. If no prefix is set it will default to `.`",
	permissions: 'ADMINISTRATOR',
	execute(client, message, args) {
		if (args[0] === 'none') {
			db.delete(`Guilds_${message.guild.id}_Prefix`);
			message.react('✅');

			const removedEmbed = new Discord.MessageEmbed().setColor(foxColor).setDescription(`**Arighty,** removed the server's custom prefix and reset back to \`.\``);

			return message.channel.send(removedEmbed).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		let prefix = args[0];
		if (!prefix) {
			let pfix = db.get(`Guilds_${message.guild.id}_Prefix`);
			if (pfix === null) {
				const noEmbed = new Discord.MessageEmbed()
					.setColor(foxColor)
					.setDescription(`There is no custom server prefix set right now. If you'd like to set one use the command \`.setprefix [prefix]\``);

				return message.channel.send(noEmbed);
			}

			const sayEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setDescription(`Right now the server's custom prefix is set to \`${pfix}\` If you wanna change it to something else use \`.setprefix [prefix]\``);

			return message.channel.send(sayEmbed);
		}
		// adding to quick.db
		db.set(`Guilds_${message.guild.id}_Prefix`, prefix);
		message.react('✅');

		const successEmbed = new Discord.MessageEmbed().setColor(foxColor).setDescription(`**Alrighty,** set the server's custom prefix as ${prefix}`);

		message.channel.send(successEmbed);
	}
};
