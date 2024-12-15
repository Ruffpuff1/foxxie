const Discord = require('discord.js');
const { serverLink } = require('../../config.json')

module.exports = {
	name: 'support',
	aliases: ['serverlink', 'link'],
	description: 'Get the invite link to The Corner Store.',
	usage: '',
	guildOnly: false,
    execute(message, args) {


		const supportEmbed = new Discord.MessageEmbed()
		.setColor('#EC8363')
		.setTitle('Here is the link to The Corner Store!')
		.setDescription(`${serverLink}\nWe hope you enjoy it!`);

message.reply(supportEmbed)

	}};