const Discord = require('discord.js');
const config = require('../config.json')
module.exports = {
    name: 'serverlist',
    description: 'shows the list of servers fokushi is in',
    aliases: ['sl', 'list'],
    execute(message, args, bot) {
        if (!config.developerID.includes(message.author.id)) return;
        let Embed = new Discord.MessageEmbed()
        Embed.setDescription(`${bot.guilds.cache.map(g => g.name).join(",\n")}`)
        Embed.setTimestamp()
        Embed.setColor(`Random`);
        message.channel.send(Embed)
    }
}