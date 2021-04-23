const Discord = require('discord.js');
const color = require('tinycolor2');
const Canvacord = require("canvacord/src/Canvacord");
module.exports = {
    name: 'color',
    aliases: ['colour'],
    usage: 'fox color (hex|rgb|hsv|hsl)',
    category: 'utility',
    execute: async(lang, message, args, client) => {
        let colorshow = args[0]
        if (!colorshow) return message.channel.send(lang.COMMAND_COLOR_NOCOLOR)
        let colorData = color(colorshow)

        let circle = await Canvacord.color(
            colorData.toHexString()
        )

        const embed = new Discord.MessageEmbed()
            .setColor(colorData.toHexString())
            .attachFiles([{name: "image.png", attachment:circle}])
            .setImage('attachment://image.png')
            .setTitle(`${lang.COMMAND_COLOR_PREVIEW} ${colorData.toHexString()}`)
            .setDescription(`**${colorData.toRgbString()}**\n**${colorData.toHsvString()}**\n**${colorData.toHslString()}**`)

        message.channel.send(embed)
    }
}