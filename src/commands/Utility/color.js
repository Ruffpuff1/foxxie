const Discord = require('discord.js');
const color = require('tinycolor2');
module.exports = {
    name: 'color',
    usage: 'fox color (color)',
    execute: async(lang, message, args, client) => {
        let colorshow = args[0]
        if (!colorshow) return message.channel.send(lang.COMMAND_COLOR_NOCOLOR)
        let colorData = color(colorshow)
        const embed = new Discord.MessageEmbed()
            .setColor(colorData.toHexString())
            .setTitle(`${lang.COMMAND_COLOR_PREVIEW} ${colorData.toHexString()}`)
            .setDescription(`**${colorData.toRgbString()}**\n**${colorData.toHsvString()}**\n**${colorData.toHslString()}**`)

        message.channel.send(embed)
    }
}