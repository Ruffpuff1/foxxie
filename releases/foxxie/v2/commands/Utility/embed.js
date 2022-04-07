const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'embed',
	aliases: ['broadcast'],
	description: "Let's you people force me to speak but this time in an embed. Requires the **[MANAGE_MESSAGES]** permission to work correctly.",
	usage: 'embed [message]',
	guildOnly: true,
	permissions: 'MANAGE_MESSAGES',
	execute(client, message, args) {
		message.delete();
		let text = args.slice(0).join(' ');
		if (!text) return;

		const embed = new Discord.MessageEmbed().setColor(foxColor).setDescription(`${text}`);
		message.channel.send(embed);
	}
};
