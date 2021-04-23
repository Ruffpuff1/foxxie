const Discord = require("discord.js");
const canvacord = require("canvacord");
module.exports = {
    name: 'changemymind',
    aliases: ['cmm'],
    usage: 'fox changemymind [text]',
    category: 'fun',
    execute: async(lang, message, args) => {

        const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);
        
        let notice3 = 'You need to provide some **text** for this command.'

	    let mindtxt = args.slice(0).join(" ");
	    if (!mindtxt) return message.channel.send(notice3)

	    let image = await canvacord.Canvas.changemymind(mindtxt);

	    let triggered = new Discord.MessageAttachment(image, "changemymind.png");

        loading.delete()
	    message.channel.send(triggered);
    }
}