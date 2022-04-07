const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'justin',
	aliases: ['j', 'beaver'],
	description: 'Gain the full name of Justin.',
	guildOnly: true,
	execute(client, message, args) {
		message.delete();
		const justinName =
			'Justin Giraffe-Whore-Blobfish-Anglerfish-Femboy-Filbert-Party Pooper-Short Spaghetti Dick-Lil Bitch-Jiu-Jutsu-Yandere-Tsundere-Sex Slave-Justie-Vuccum-Stalker-Canadian Murderer-Monsieur Casanova Fairness Know It All Wholesome Cutie Pie-Witch-Pendejo-Dennis';
		const justinEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setThumbnail('https://cdn.discordapp.com/avatars/282321212766552065/97dff710cef05a13142c623778f4b974.webp?size=512')
			.setDescription(`**Here is the full name of <@282321212766552065>:**\n*${justinName}*`);

		message.reply(justinEmbed).then(msg => {
			setTimeout(() => msg.delete(), 100000);
		});
	}
};
