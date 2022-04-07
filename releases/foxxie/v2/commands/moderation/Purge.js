const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'prune',
	aliases: ['purge', 'clear', 'clean', 'delete', 'p'],
	description: 'Mass delete messages up to 100 messages at once',
	usage: '[messages] (-p)',
	guildOnly: true,
	permissions: 'MANAGE_MESSAGES',
	execute(client, message, args) {
		let amount = args[0];
		let reason = args.slice(1).join(' ') || 'none';
		let amountLimit = Number(amount);
		let logchn = db.get(`Guilds_${message.guild.id}_Logchannel`);
		const purgeTime = moment(message.createdTimestamp).format('llll');
		// if no number provided
		if (!amount) {
			message.react('❌');
			return message.channel.send('If you want me to purge some messages for you, ya gotta tell me how many.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		// if args[0] NaN
		if (isNaN(amount)) {
			message.react('❌');
			return message.channel.send('How you you expect me to purge that? Gotta give me a *real* number please.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		// if amount greated than 100 or less than 0
		if (amount > 100 || amount < 0) {
			message.react('❌');
			return message.channel
				.send(
					"**Heya,** due to Discord's limitations right now I can only purge with numbers greater than 0 and less than 100. Please try again with a valid number."
				)
				.then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
		}
		// actual purging
		message.channel.messages.fetch({ limit: amountLimit + 1 }).then(fetched => {
			const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
			message.channel.bulkDelete(notPinned, true).catch(err => {
				message.react('❌');
				return message.channel.send("**Sorry,** due to Discord's limitations I can't mass delete messages older than fourteen days.");
			});

			const purgeEmbed = new Discord.MessageEmbed()
				.setTitle(`Purged ${amount} messages`)
				.setColor(foxColor)
				.setTimestamp()
				.addFields(
					{
						name: '**Purged Messages**',
						value: `${amount} messages purged`,
						inline: true
					},
					{
						name: '**Moderator**',
						value: `<@${message.member.user.id}> (ID: ${message.member.user.id})`,
						inline: true
					},
					{ name: '\u200B', value: '\u200B', inline: true }
				)
				.addFields(
					{
						name: `**Reason**`,
						value: `${reason}`,
						inline: true
					},
					{
						name: `**Location**`,
						value: `<#${message.channel.id}>`,
						inline: true
					},
					{
						name: `**Date / Time**`,
						value: `${purgeTime}`,
						inline: true
					}
				);

			db.add(`Users_${message.author.id}_Purges_${message.guild.id}`, 1);
			db.add(`Users_${message.author.id}_Purgetotal_${message.guild.id}`, amount);

			if (logchn === null) return;

			const logChannel = message.guild.channels.cache.get(logchn);

			logChannel.send(purgeEmbed);
		});
	}
};
