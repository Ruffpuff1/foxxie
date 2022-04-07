const { foxColor } = require('../../config.json');
const Discord = require('discord.js');
const db = require('quick.db');
module.exports = {
	name: 'modlogs',
	aliases: ['stafflogs', 'ml'],
	description: 'Allows you to see the amount of bans, kicks, and slowmodes a mod had set.',
	usage: '(user)',
	guildOnly: true,
	permissions: 'MANAGE_MESSAGES',
	execute(client, message, args) {
		let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

		let isStaff = message.channel.permissionsFor(mentionMember);

		if (!isStaff.has('MANAGE_MESSAGES') || mentionMember.user.bot === true) {
			message.channel
				.send(
					"❌ **Heya,** this user likely isn't a staff member of this server, and therefore would'nt have any logs to display. Try again with an actual staff member."
				)
				.then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			message.delete();
			return;
		}

		let bansDone = db.get(`Users_${mentionMember.user.id}_Bans_${message.guild.id}`) || '0';
		let kicksDone = db.get(`Users_${mentionMember.user.id}_Kicks_${message.guild.id}`) || '0';
		let slowmodesDone = db.get(`Users_${mentionMember.user.id}_Slowmodes_${message.guild.id}`) || '0';
		let purgesDone = db.get(`Users_${mentionMember.user.id}_Purges_${message.guild.id}`) || '0';
		let totalPurges = db.get(`Users_${mentionMember.user.id}_Purgetotal_${message.guild.id}`) || '0';
		let locksdone = db.get(`Users_${message.author.id}_Locks_${message.guild.id}`) || '0';
		let unlocksdone = db.get(`Users_${message.author.id}_Unlocks_${message.guild.id}`) || '0';
		let warnsDone = db.get(`Users_${message.author.id}_Warns_${message.guild.id}`) || '0';

		const modLogEmbed = new Discord.MessageEmbed()
			.setTitle(`${mentionMember.user.tag}\`s Staff Actions`)
			.setDescription(`Here is the amount of moderation actions **${mentionMember.user.tag}** has performed in this server.`)
			.setColor(foxColor)
			.addFields(
				{
					name: `**Warnings**`,
					value: `**${warnsDone}** warnings given`,
					inline: true
				},
				{
					name: '**Kicks**',
					value: `**${kicksDone}** Kicks Given`,
					inline: true
				}
				//{ name: '\u200B', value: '\u200B', inline: true })
			)
			.addFields(
				{ name: `\u200B`, value: `\u200B`, inline: true },
				{
					name: `**Slowmodes**`,
					value: `**${slowmodesDone}** slowmodes issued`,
					inline: true
				},
				{
					name: '**Bans**',
					value: `**${bansDone}** Bans Given`,
					inline: true
				},
				{
					name: `**Purges**`,
					value: `**${purgesDone}** purges done\nclearing a total of **${totalPurges}** messages`,
					inline: true
				}
			)
			.setTimestamp();

		message.channel.send(modLogEmbed);
	}
};
