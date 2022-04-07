const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const ms = require('ms');
const { botOwner } = require('../config.json');
module.exports = client => {
	client.commands = new Discord.Collection();
	const commandFolders = fs.readdirSync('./commands');
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`../commands/${folder}/${file}`);
			client.commands.set(command.name, command);
		}
	}

	client.on('message', message => {
		let prefix = '.';

		if (message.author.bot) return;
		if (message.channel.type === 'text') prefix = db.get(`Guilds_${message.guild.id}_Prefix`) || '.';

		let mentionPrefix = '<@!812546582531801118>';

		if (message.content.toLowerCase() === '!d bump' && !db.has(`Guilds_${message.guild.id}_Disboardremind`) && message.channel.id === '798917541140365382') {
			client.disboard = require('../disboard.json');
			let remindTime = '2h';
			let disboardBump = 'Bumpreminder';
			db.set(`Guilds_${message.guild.id}_Disboardremind`, true);

			client.disboard[disboardBump] = {
				guild: message.guild.id,
				authID: message.author.id,
				time: Date.now() + ms(remindTime),
				channelID: message.channel.id
			};
			fs.writeFile('./disboard.json', JSON.stringify(client.disboard, null, 4), err => {
				if (err) throw err;
				message.react('✅');
			});
		}

		if (message.content === '!j help' || (message.content === '!J help' && message.guild.id === '761512748898844702')) {
			const justin = message.guild.members.cache.get('282321212766552065');

			const embed = new Discord.MessageEmbed()
				.setTitle("J Bot's Commands")
				.setColor(justin.roles.highest.color)
				.setThumbnail(justin.user.avatarURL({ dynamic: true }))
				.addFields(
					{
						name: '!J play',
						value: 'Will make J bot type a random confusing thing.',
						inline: false
					},
					{
						name: `!J die`,
						value: 'Will make J bot say bad things.',
						inline: false
					},
					{
						name: `!J love [user]`,
						value: `Will make J bot say a nice thing about the user mentioned.`,
						inline: false
					},
					{
						name: `!J ping`,
						value: `Will display the current ping level of the J bot.`,
						inline: false
					},
					{
						name: '!J sad',
						value: `J bot will recomfort you.`,
						inline: false
					},
					{
						name: `!J why`,
						value: `J bot will talk about his miserable life`,
						inline: false
					}
				);

			const webhookClient = new Discord.WebhookClient('823940847979593779', '4wkJrGVvboqWrF5bSzB1Wo4nU8qH0ovq0yiaFCyRRdAnXKYEmunnFza6MtA33AhQfLzl');
			message.delete();
			webhookClient.send({
				username: `${justin.user.username} bot`,
				avatarURL: justin.user.avatarURL({ dynamic: true }),
				embeds: [embed]
			});
		}

		if (message.content.startsWith(mentionPrefix) && message.content.length === mentionPrefix.length) {
			message.channel.send(`Heya! My prefixes are \`fox \` and \`${prefix}\`. Try out \`fox help\` to get all my commands.`).then(msg => {
				setTimeout(() => msg.delete(), 30000);
			});
		}

		// . prefix
		if (message.content.startsWith(prefix)) {
			const args = message.content.slice(prefix.length).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();
			const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			if (!command) return;

			if (command.guildOnly && message.channel.type === 'dm') {
				message.react('❌');
				return message.reply(`❌ **Wrong place**, the \`${commandName}\` command can only be used in servers k? Try again there.`).then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
			if (command.permissions) {
				const authorPerms = message.channel.permissionsFor(message.author);
				if (!authorPerms || !authorPerms.has(command.permissions)) {
					message.react('❌');
					return message.channel.send(`❌ **Missing Permissions!** You need the **${command.permissions}** permission to run this command.`).then(msg => {
						setTimeout(() => msg.delete(), 5000);
					});
				}
			}
			message.flags = [];
			while (args[0] && args[0][0] === '-') {
				message.flags.push(args.shift().slice(1));
			}

			try {
				command.execute(client, message, args);
			} catch (error) {
				console.error(error);
				message.react('❌');
				message.channel.send(`❌ There seems to be a problem with my source code. Dm <@${botOwner}> with the command you were tryna run.`);
			}
		}
		// fox and Fox prefixes
		if (message.content.startsWith('fox') || message.content.startsWith('Fox')) {
			const args = message.content.slice(3).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();
			const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			if (!command) return;
			if (command.guildOnly && message.channel.type === 'dm') {
				message.react('❌');
				return message.reply(`❌ **Wrong place**, the \`${commandName}\` command can only be used in servers k? Try again there.`).then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
			if (command.permissions) {
				const authorPerms = message.channel.permissionsFor(message.author);
				if (!authorPerms || !authorPerms.has(command.permissions)) {
					message.react('❌');
					return message.channel.send(`❌ **Missing Permissions!** You need the **${command.permissions}** permission to run this command.`).then(msg => {
						setTimeout(() => msg.delete(), 5000);
					});
				}
			}

			message.flags = [];
			while (args[0] && args[0][0] === '-') {
				message.flags.push(args.shift().slice(1));
			}

			try {
				command.execute(client, message, args);
			} catch (error) {
				console.error(error);
				message.react('❌');
				message.channel.send(`❌ There seems to be a problem with my source code. Dm <@${botOwner}> with the command you were tryna run.`);
			}
		}
	});
};
