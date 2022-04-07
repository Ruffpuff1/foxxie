const Discord = require('discord.js');
module.exports = {
	name: 'say',
	aliases: ['speak', 'message'],
	description: "Let's you people force me to speak. Requires the permission **[MANAGE_MESSAGES]** to execute correctly.",
	usage: 'say [message]',
	guildOnly: true,
	permissions: 'MANAGE_MESSAGES',
	execute(client, message, args) {
		message.delete();
		let text = args.slice(0).join(' ');
		if (!text) return;
		message.channel.send(`${text}`);
	}
};
