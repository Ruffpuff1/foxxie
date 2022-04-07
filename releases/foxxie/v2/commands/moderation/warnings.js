const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'warnings',
	usage: 'warnings [user/userid]',
	description: 'view all the warnings of a user, includes the time, date, and moderator who gave the warning.',
	permissions: 'MANAGE_MESSAGES',
	execute: async (client, message, args) => {
		let user;
		if (!args[0]) user = message.author;
		if (args[0] && isNaN(args[0])) user = message.mentions.users.first();
		if (args[0] && !isNaN(args[0])) {
			user = client.users.cache.get(args[0]);

			if (!message.guild.members.cache.has(args[0])) {
				message.react('❌');
				return message.channel.send("Yeahhhh I can't exactly find that user. Try again.").then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
		}
		if (!user) {
			message.react('❌');
			return message.channel.send('Ya gotta tag a user for me to show warnings.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		const number = db.fetch(`Users_${user.id}_Warnings_${message.guild.id}_Number`);
		const warnInfo = db.fetch(`Users_${user.id}_Warnings_${message.guild.id}_Info`);

		if (!number || !warnInfo || warnInfo == []) {
			message.react('❌');
			return message.channel.send("I don't really know what you want me to show since this user doesn't have any warnings.").then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}

		const warnembed = new Discord.MessageEmbed().setTitle(`${user.tag}\'s Warnings`).setColor(foxColor).setTimestamp();

		for (let warnings of warnInfo) {
			let modtag = warnings.moderator;
			let modID = warnings.modID;
			let reason = warnings.reason;
			let date = warnings.date;

			//warnembed.addField(`${user.tag} warns`,`**Moderator:** ${mod}\n**Reason:** ${reason} \n**Date:** ${date}\n**Warn ID:** \`${warnings.id}\``, false)
			warnembed.addField(
				`Warning ID: ${warnings.id}`,
				`**Moderator:** ${modtag} (ID: ${modID})\n**Date:** ${date}\n**Reason:**\n\`\`\`
${reason}
\`\`\``
			);
		}

		message.channel.send(warnembed);
	}
};
