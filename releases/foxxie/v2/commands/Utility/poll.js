const { MessageEmbed } = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'poll',
	aliases: ['strawpoll'],
	description:
		'Allows server moderations to create a strawpoll ex: "Should I do x thing?" adds two reactions to the message for easy polling. Requires the **[MANAGE_MESSAGES]** permission to execute properly.',
	usage: 'poll [question]',
	guildOnly: true,
	permissions: 'MANAGE_MESSAGES',
	async execute(client, message, args) {
		if (!args[0])
			return message.channel.send('**Please Enter A Query!**').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});

		const embed = new MessageEmbed()
			.setColor(foxColor)
			.setTitle(`${message.guild.name}: Poll`)
			.setFooter(message.member.displayName, message.author.displayAvatarURL())
			.setTimestamp()
			.setDescription(args.join(' '));
		var msg = await message.channel.send(embed);

		await msg.react('✅');
		await msg.react('❌');

		message.delete({ timeout: 1000 });
	}
};
