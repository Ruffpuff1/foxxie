const db = require('quick.db');
module.exports = {
	name: 'clearwarnings',
	usage: 'clearwarnings [user/userid]',
	description: 'Clear all the warnings of a user. Needs administrator permissions.',
	permissions: 'ADMINISTRATOR',
	execute: async (client, message, args) => {
		let user;
		if (args[0] && isNaN(args[0])) user = message.mentions.users.first();
		if (args[0] && !isNaN(args[0])) {
			user = client.users.cache.get(args[0]);

			if (!message.guild.members.cache.has(args[0])) {
				message.react('❌');
				return message.channel.send('If you want to clear the warnings of someone you need provide an actual user.').then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
		}
		if (db.has(`Users_${user.id}_Warnings_${message.guild.id}_Number`)) {
			db.delete(`Users_${user.id}_Warnings_${message.guild.id}_Number`);
			db.delete(`Users_${user.id}_Warnings_${message.guild.id}_Info`);
			message.react('✅');
			return;
		}
		message.react('❌');
		message.channel.send("This user doesn't have any warnings right now :>").then(msg => {
			setTimeout(() => msg.delete(), 5000);
		});
	}
};
