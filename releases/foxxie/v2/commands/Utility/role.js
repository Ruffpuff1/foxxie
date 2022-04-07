const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
	name: 'role',
	aliases: ['roleinfo', 'role-info'],
	description: 'Get information about a role in the guild',
	usage: 'role [role/rolename/roleid]',
	guildOnly: true,
	execute(client, message, args) {
		const roleName =
			message.mentions.roles.first() ||
			message.guild.roles.cache.get(args[0]) ||
			message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
		if (roleName === undefined) {
			message.react('❌');
			return message.channel.send('❌ **Please,** provide a proper role name or id for this command.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		console.log(roleName);

		const created = moment(roleName.createdAt).format('llll');
		var daysSinceCreated = moment().diff(created, 'days');

		let membermap =
			roleName.members
				.sort((a, b) => b.position - a.position)
				.map(r => r.user.username)
				.slice(0, 40)
				.join(', ') + `\nand more...`;
		if (!membermap) membermap = 'No members';

		const embed = new Discord.MessageEmbed()
			.setColor(roleName.color)
			.setTitle(`${roleName.name} (ID: ${roleName.id})`)
			.setDescription(`Here\'s some info about the **${roleName.name}** role of **${roleName.guild}**.`)
			.addFields(
				{
					name: ':art: **Role Color** ',
					value: `<-- ${roleName.hexColor}`,
					inline: true
				},
				{
					name: ':1234: **Position** ',
					value: roleName.position,
					inline: true
				},
				{
					name: `:people_hugging: **Members (${roleName.members.size})** `,
					value: `\`\`\`${membermap}\`\`\``,
					inline: false
				},
				{
					name: ':calendar: **Created At** ',
					value: `${created} **(${daysSinceCreated} days ago.)**`,
					inline: false
				}
			);

		message.channel.send(embed);
	}
};
