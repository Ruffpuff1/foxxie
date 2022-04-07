const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'coinflip',
	aliases: ['flip', 'coin'],
	description: 'Flip a coin.',
	usage: '[heads or tails]',
	guildOnly: true,
	execute(client, message, args) {
		if (!args[0]) {
			return message.channel.send('Heya you gotta choose between heads or tails.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}

		let prediction = args[0];
		var res = prediction.toLowerCase();
		const n = Math.floor(Math.random() * 2);
		let result;

		if (n === 1) result = 'heads';
		else result = 'tails';

		const rembed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setAuthor(`${message.member.displayName} Flipped ${result}!`, message.member.user.avatarURL())
			.setDescription(`You were **right!** :coin:`);

		const wembed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setAuthor(`${message.member.displayName} Flipped ${result}!`, message.member.user.avatarURL())
			.setDescription(`You were **wrong.** :coin:`);

		if (res === result) {
			message.channel.send(rembed);
		} else message.channel.send(wembed);
	}
};
