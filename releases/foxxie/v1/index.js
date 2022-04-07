const fs = require('fs');
const Discord = require('discord.js');
const { prefix, serverLink, botOwner } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.once('ready', () => {
	console.log('Ready!');
	console.log(`${botOwner}`);

	//memberCount(client);
});

client.on('ready', () => {
	console.log('starting member count status set');
	client.user.setActivity(client.users.cache.size + ` users | The Corner Store : \n${serverLink}`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply(`**Wrong place**, the \`${commandName}\` command is only useable in servers, please try again in a server rather than DMs`);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.channel.send(`It appears there was an issue with my source code, please DM <@${botOwner}> with the command you were trying to run ${message.author}`);
	}
});

client.login(process.env.token);
