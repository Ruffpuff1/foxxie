const Discord = require('discord.js');
const { serverLink } = require('../../config.json')
const client = new Discord.Client();

module.exports = {
	name: 'about',
	aliases: ['info'],
	description: 'Get some basic information about the bot.',
	usage: '',
	guildOnly: false,
	execute(message, args) {


		console.log('ran /`about/` command');


        // Important Variables
        const creation = 'Mon, Feb 15th 2021'
        const botVersion = 'v0.1'

		// (Major version).(Minor version).(Revision number)

		/* v0.1
		basic command sequence
		ping.js
		avatar.js
		server.js
		user.js
		about.js */
		// v0.2 added help sequence
		const aboutEmbed = new Discord.MessageEmbed()
	.setColor('#EC8363')
    .setThumbnail('https://cdn.discordapp.com/avatars/809750593077379122/f6c44736216ac4e80b46880adc4e35f1.webp?size=512')

	.setTitle('About Foxie!')
	.setDescription('Foxie is a developmental project by <@486396074282450946> as a fun way of learning Discord.js. Currently being used in his server **The Corner Store**.')
    .addFields(
        { name: 'Created', value: `Foxie was created on **${creation}**` , inline: true },
		{ name: 'Version', value: `${botVersion}` , inline: true },)
	.addFields(
		{ name: 'Servers', value: 'Foxie is helping with ' + `**2**` + ' servers!' , inline: false },
		{ name: 'The Corner Store', value: `${serverLink}` , inline: false },)
		message.reply(aboutEmbed)}};