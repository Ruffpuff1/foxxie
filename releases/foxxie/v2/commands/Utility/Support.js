const Discord = require('discord.js');
const { serverLink, foxColor } = require('../../config.json');
module.exports = {
	name: 'support',
	aliases: ['serverlink', 'link', 'invite', 'inv'],
	description: 'Provides you with the server invite link for The Corner Store.',
	usage: 'link',
	guildOnly: true,
	execute(client, message, args) {
		const supportEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setTitle('Here is the link to The Corner Store!')
			.setDescription(`${serverLink}\nHope ya have a good time.`);
		message.react('✅');
		message.author.send(supportEmbed).catch(error => {
			console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
			message.channel
				.send(
					`❌ **Whoops** I tried to DM you but I could\'t ${message.author}, please make sure your dms are open to everyone so I can send you a message in DMs`
				)
				.then(msg => {
					setTimeout(() => msg.delete(), 10000);
				})
				.catch();
			message.delete();
			return;
		});
		message.react('✅');
	}
};
