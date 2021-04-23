const Discord = require("discord.js");
const canvacord = require("canvacord");
module.exports = {
    name: 'gay',
    aliases: ['homo', 'baguette'],
    usage: 'fox gay (user)',
    category: 'fun',
    execute: async(lang, message, args) => {
        let target = message.mentions.users.first() || message.author;
        const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);

	let avatar = message.attachments.array()[0];

	if (avatar) {
		if (avatar.url) {
			let image = await canvacord.Canvas.rainbow(avatar.url);
			let rainbow = new Discord.MessageAttachment(image, "rainbow.png");
            loading.delete();
			return message.channel.send(rainbow);
		}
	} else {
		let image = await canvacord.Canvas.rainbow(
			target.displayAvatarURL({ dynamic: false, format: "png" })
		);
		let rainbow = new Discord.MessageAttachment(image, "rainbow.png");
        loading.delete();
		return message.channel.send(rainbow);
	}
    }
}