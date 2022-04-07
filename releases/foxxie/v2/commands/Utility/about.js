const Discord = require('discord.js');
const { serverLink, botVer, numOfCommands, botAv, lastUpdate, numOfAliases, foxColor } = require('../../config.json');
const moment = require('moment');
const creation = 'Mon, Feb 15th 2021';
var daysSinceCreation = moment().diff('2021-02-15', 'days');

module.exports = {
	name: 'about',
	aliases: ['info'],
	description: 'Get some basic information about the bot.',
	usage: 'about',
	guildOnly: true,
	execute(client, message, args) {
		const aboutEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setThumbnail(`${botAv}`)
			.setTitle('About Foxxie!')
			.setDescription(
				'I started as a developmental project by **Ruffpuff#0017** as a way for him to better learn Discord.js. I was then added to his server **The Corner Store** as a way to reduce the amount of bots. Now I hope I can be of some use to you!'
			)
			.addFields(
				{
					name: '**Created**',
					value: `**•** I was created on ${creation}. **(${daysSinceCreation} days ago.)**\n**•** My last update was on **${lastUpdate}.**`,
					inline: false
				},
				{
					name: '**Version**',
					value: `**•** I'm in version **${botVer}** I'm always getting worked on though. ;)`,
					inline: false
				},
				{
					name: '**Commands**',
					value: `**•** Right now I have **${numOfCommands}** commands and **${numOfAliases}** aliases, but I'm sure more will be added soon.`,
					inline: false
				},
				{
					name: '**Users**',
					value: `**•** I gotta clean up after **${client.users.cache.size}** users.`,
					inline: false
				},
				{
					name: '**Servers**',
					value: `**•** Right now I\'m watching **${client.guilds.cache.size}** servers.`,
					inline: false
				},
				{
					name: '**Credits**',
					value: '**• Ruffpuff#0017** is my one and only dev he originally created me to help around his server.\n**•** Some of my roleplay gifs were collected by **sug4r#1537** from tenor!',
					inline: false
				},
				{
					name: '**Extra links and information**',
					value: `[[The Corner Store](${serverLink})] | [[Vote](https://top.gg/servers/761512748898844702)] | [[Disboard](https://disboard.org/server/761512748898844702)] | [[Patreon](https://www.patreon.com/Thecornerstore)]`,
					inline: false
				}
			);

		message.reply(aboutEmbed);
	}
};
