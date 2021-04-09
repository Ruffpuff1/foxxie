const Discord = require('discord.js')
module.exports = {
    name: 'steal',
    aliases: ['se', 'yoink', 'take'],
    usage: 'fox steal [emoji] (name)',
    execute: async (lang, message, args) => {

        if (!args[0]) return message.channel.send(`COMMAND_STEAL_NO_ARGS`)

        let ext = '.png'
        if (args[0].includes('<a:')) ext = '.gif'
        let name = args[1]

        const regex = args[0].replace(/^<a?:\w+:(\d+)>$/, '$1');
        if (!name) name = regex

        let url = `https://cdn.discordapp.com/emojis/${regex}${ext}?v=1`;

        message.guild.emojis.create(url, name)
        
        const embed = new Discord.MessageEmbed()
        .setTitle(`Stole ${name}`)
        .setColor(message.guild.me.displayColor)
        .setDescription(`**ID:** \`${regex}\`\n**Raw:** \`<${ext = '.gif'?'a':''}:${name}:${regex}>\``)
        .setImage(url)

        message.channel.send(embed)
    }
}