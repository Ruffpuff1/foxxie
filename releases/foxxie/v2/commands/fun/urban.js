const urban = require('relevant-urban');
const { foxColor } = require('../../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'urban',
	aliases: ['urbandictionary', 'word'],
	description: 'Search up a word on Urban Dictionary. Provides definition, link to word, and word rating.',
	usage: 'urban [word]',
	guildOnly: true,
	execute: async (client, message, args) => {
		if (!message.channel.nsfw) return message.channel.send('Due to the possible *risqué* nature of this command, it can only be used in channels marked as NSFW.');
		if (!args[0]) return message.channel.send('Please Enter Something To Search');

		let image = 'http://cdn.marketplaceimages.windowsphone.com/v8/images/5c942bfe-6c90-45b0-8cd7-1f2129c6e319?imageType=ws_icon_medium';
		try {
			let res = await urban(args.join(' '));
			if (!res) return message.channel.send('No results found for this topic, sorry!');
			let { word, urbanURL, definition, example, thumbsUp, thumbsDown, author } = res;

			let embed = new Discord.MessageEmbed()
				.setColor(foxColor)
				.setTitle(`Urban Dictionary - ${word}`)
				.setThumbnail(image)
				.setDescription(`**Defintion:**\n\*${definition || 'No definition'}\*\n\n**Example:**\n*${example || 'No Example'}*`)
				.addField('**Rating:**', `**\`Upvotes: ${thumbsUp} | Downvotes: ${thumbsDown}\`**`)
				.addField('**Link**', `[Link to ${word}](${urbanURL})`, true)
				.addField('**Author:**', `${author || 'Unknown'}`, true)
				.setTimestamp();

			message.channel.send(embed);
		} catch (e) {
			console.log(e);
			return message.channel.send("looks like i've broken! Try again");
		}
	}
};
