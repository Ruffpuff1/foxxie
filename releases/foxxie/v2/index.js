const Discord = require('discord.js');
const db = require('quick.db');
const DisTube = require('distube');
const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const fs = require('fs');
const { botOwner, token, foxColor, emoji } = require('./config.json');

const memberCount = require('./Fuctions/member-count');
const welcomeMessage = require('./Fuctions/welcomemessage');
const clock = require('./Fuctions/clock');
const activities = require('./Fuctions/activities');
const messageUpdate = require('./Fuctions/message-update');
const messageDelete = require('./Fuctions/message-delete');
const commands = require('./Fuctions/commands');
const distube = require('./Fuctions/distube');

client.distube = new DisTube(client, {
	searchSongs: false,
	emitNewSongOnly: false,
	leaveOnFinish: false
});
client.emotes = emoji;
client.msgs = require('./msgs.json');
client.disboard = require('./disboard.json');

client.once('ready', () => {
	console.log('Ready!');
	console.log(botOwner);

	activities(client);
	clock(client);
	welcomeMessage(client);
	memberCount(client);
	messageUpdate(client);
	messageDelete(client);
	commands(client);
	distube(client);

	client.setInterval(() => {
		for (let i in client.disboard) {
			let guildID = client.disboard[i].guild;
			let authID = client.disboard[i].authID;
			let disbordTime = client.disboard[i].time;
			let guild = client.guilds.cache.get(guildID);
			let channelID = client.disboard[i].channelID;
			let channel = guild.channels.cache.get(channelID);

			if (Date.now() > disbordTime) {
				if (disbordTime === null) return;
				if (channel === undefined) return;

				const remindEmbedDisboard = new Discord.MessageEmbed()
					.setColor(foxColor)
					.setTitle(`Reminder to Bump`)
					.setThumbnail(client.user.displayAvatarURL())
					.setDescription(`**•** Time to bump the server on disboard. Use the command \`!d bump\` then come back in **two hours**.`)
					.setTimestamp()
					.setFooter(guild.name, guild.iconURL({ dynamic: true }));

				channel.send("**Heya <@&774339676487548969> it's time to bump the server.**", {
					embed: remindEmbedDisboard
				});
				delete client.disboard[i];

				fs.writeFile('./disboard.json', JSON.stringify(client.disboard, null, 4), err => {
					if (err) throw err;
				});

				db.delete(`Guilds_${guildID}_Disboardremind`);
			}
		}
	});

	client.setInterval(() => {
		for (let i in client.msgs) {
			let time = client.msgs[i].time;
			let guildID = client.msgs[i].guild;
			let authID = client.msgs[i].authID;
			let remindMessage = client.msgs[i].message;
			let guild = client.guilds.cache.get(guildID);
			let member = guild.members.cache.get(authID);
			let timeSince = `**${client.msgs[i].timeago}** ago for:`;

			if (Date.now() > time) {
				if (time === null) return;

				const remindEmbed = new Discord.MessageEmbed()
					.setAuthor(`Reminder For ${member.user.username}`, client.user.displayAvatarURL())
					.setColor(foxColor)
					.setDescription(`Hey there, here's that reminder you scheduled ${timeSince} **${remindMessage}**`)
					.setTimestamp();

				member.send(remindEmbed);
				delete client.msgs[i];

				fs.writeFile('./msgs.json', JSON.stringify(client.msgs, null, 4), err => {
					if (err) throw err;
				});
			}
		}
	}, 1000);
});

client.on('message', message => {
	if (message.author.bot) return;

	if (message.channel.type === 'dm') {
		const embed = new Discord.MessageEmbed().setColor(foxColor).setDescription(`**${message.author.tag}**: ${message.content}`);

		client.channels.cache.get('814316968966094878').send(embed);
	}

	if (message.channel.type === 'dm') return;

	//checking for AFK message
	if (db.has(`Users_${message.author.id}_Afk_${message.guild.id}`)) {
		let afkNickname = db.get(`Users_${message.author.id}_Afknickname_${message.guild.id}`);
		message.reply("Oh you're back! i removed your afk").then(msg => {
			setTimeout(() => msg.delete(), 10000);
		});
		message.member
			.setNickname(`${afkNickname}`)
			.catch(error => console.error())
			.then(
				db.delete(`Users_${message.author.id}_Afk_${message.guild.id}`),
				db.delete(`Users_${message.author.id}_Afkmessage_${message.guild.id}`),
				db.delete(`Users_${message.author.id}_Afknickname_${message.guild.id}`)
			);
	}
	// checks if AFK user is mentioned
	message.mentions.users.forEach(user => {
		if (message.author.bot) return false;
		if (message.content.includes('@here') || message.content.includes('@everyone')) return false;
		if (db.has(`Users_${user.id}_Afk_${message.guild.id}`)) {
			let afkReasonShow = db.get(`Users_${user.id}_Afkmessage_${message.guild.id}`);
			const UserAFKEmbed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setAuthor(`${user.tag} is set as AFK`, `${user.avatarURL()}`)
				.setDescription(`**Reason:** ${afkReasonShow}`);
			message.channel.send(UserAFKEmbed).then(msg => {
				setTimeout(() => msg.delete(), 10000);
			});
		}
	});
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.message.channel.type === 'dm') return;

	if (reaction.emoji.id === '824751934539825232' && reaction.message.id === '833960900477714462') {
		const member = reaction.message.guild ? await reaction.message.guild.members.fetch(user).catch(() => null) : null;
		if (member) {
			let announcementPing = reaction.message.guild.roles.cache.find(r => r.id === '833964155849277461');

			member.roles.add(announcementPing);
		}
	}
});

client.on('messageReactionRemove', async (reaction, user) => {
	if (reaction.message.channel.type === 'dm') return;

	if (reaction.emoji.id === '824751934539825232' && reaction.message.id === '833960900477714462') {
		const member = reaction.message.guild ? await reaction.message.guild.members.fetch(user).catch(() => null) : null;
		if (member) {
			let announcementPing = reaction.message.guild.roles.cache.find(r => r.id === '833964155849277461');

			member.roles.remove(announcementPing);
		}
	}
});

client.login(token);
