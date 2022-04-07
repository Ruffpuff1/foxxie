const Discord = require('discord.js');
const { prefix, serverLink } = require('../../config.json');

const helpEmbed = new Discord.MessageEmbed()
	.setColor('#EC8363')
	.setTitle("Foxie's Features")
	.setDescription(
		`To check out a section or command use \`${prefix} help [section / command name]\`\n
     If you want this command to show up in chat instead of dms add \`-c\` at the end of the command. So \`${prefix} help -c\` or \`${prefix} help moderation -c\`\n
     For arguments in commands:\n
     \`[]\` means it\'s required\n\`()\` means it\'s optional\n\`{}\` means it\'s either required or not based on the usage\n**Do not actually include the [], () & {} symbols in the command**`
	)
	.addFields(
		{
			name: ':shield: **Moderation**',
			value: '*Keep your server safe with advanced moderation commands*\n**1 Command**',
			inline: true
		},
		{
			name: ':chart_with_upwards_trend: **Info**',
			value: '*Get information about users, emotes, channels etc. and live counters*\n**6 Commands**',
			inline: true
		},
		{
			name: ':flashlight: Utility',
			value: "*Useful left over commands that don't fit elsewhere*\n**2 Commands**",
			inline: true
		},
		{
			name: ':laughing: Memes',
			value: '*Have a good laugh with everyone in the server*\n**1 Command**',
			inline: true
		},
		{
			name: '**Extra links and information**',
			value: `[[The Corner Store](${serverLink})]`,
			inline: false
		}
	);

const helpUtilityEmbed = new Discord.MessageEmbed()
	.setColor('#EC8363')
	.setTitle("Foxie's Utility Commands")
	.setDescription("Some random useful commands that don't fit into any other section but are still nice to have.")
	.addFields(
		{
			name: `**${prefix} help (section | command)**`,
			value: `Shows information about my commands, sections or a specific command.`,
			inline: false
		},
		{
			name: `**${prefix} link**`,
			value: `Provides the link to "The Corner Store"`,
			inline: false
		}
	);

const helpModerationEmbed = new Discord.MessageEmbed()
	.setColor('#EC8363')
	.setTitle("Foxie's Moderation Commands")
	.setDescription(
		`These are the commands you can use to keep your server safe. All moderation commands automatically get logged in the log channel if one is set with \`${prefix} logchannel [channel]\` so you can keep track of what your staff is doing.`
	)
	.addFields({
		name: `**${prefix} purge (@user) {amount} (reason) (-p)**`,
		value: `Mass delete messages up to 1000 messages at once. You can also clear the messages by a specific user in the last 100 messages sent. By default I don't delete pinned messages. you can add \`-p\` to also purge pinned messages.`,
		inline: false
	});

const helpInfoEmbed = new Discord.MessageEmbed()
	.setColor('#EC8363')
	.setTitle("Foxie's Info Commands")
	.setDescription(
		`Get information about almost anything on Discord. I can track statistics live with voice channels, find people their profile picture links, show emojis and server details and way more.`
	)
	.addFields(
		{
			name: `**${prefix} about**`,
			value: `Get some basic information about me and some of my statistics.`,
			inline: false
		},
		{
			name: `**${prefix} avatar (@user)**`,
			value: `Get some basic information about me and some of my statistics.`,
			inline: false
		},
		{
			name: `**${prefix} ping**`,
			value: `Ping me and Discord to see how long it takes for me to send a response.`,
			inline: false
		},
		{
			name: `**${prefix} server**`,
			value: `Get information about server like who owns it, what roles it has and how many channels it has.`,
			inline: false
		},
		{
			name: `**${prefix} user (@user)**`,
			value: `Get information about any user like when their account was created. If they aren't in the server you can use their user ID instead.`,
			inline: false
		}
	);

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '(section / command)',
	cooldown: 5,
	guildOnly: false,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push(helpEmbed);

			return message.author
				.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.channel.send(`**Got it!** I sent you a DM with information on how to use me. Please check your DMs ${message.author}`).then(msg => {
						setTimeout(() => msg.delete(), 10000);
					});
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.channel
						.send(
							`**Whoops** I tried to DM you but I could\'t ${message.author}, please make sure your dms are open to everyone so I can send you a message in DMs`
						)
						.then(msg => {
							setTimeout(() => msg.delete(), 10000);
						})
						.catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
				});

			// ...
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("that's not a valid command!");
		}

		const helpCommandEmbed = new Discord.MessageEmbed()
			.setColor('#EC8363')
			.setTitle(`${prefix} ${command.name}`)
			.setDescription(
				`*(Aliases: ${command.aliases.join(', ')})*\n\n**Description:** ${command.description}\n\n**Examples:**\n\`${prefix} ${command.name} ${
					command.usage
				}\`\n\n**Cooldown** ${command.cooldown || 3} second(s)`
			);

		if (command.name === '-c') {
			return message.channel.send(helpEmbed);
		}

		if (command.name === 'moderation') {
			return message.channel.send(helpModerationEmbed);
		}

		if (command.name === 'info') {
			return message.channel.send(helpInfoEmbed);
		}

		if (command.name === 'utility') {
			return message.channel.send(helpUtilityEmbed);
		}

		if (command.name !== '-c') {
			return message.channel.send(helpCommandEmbed);
		}
	}
};
