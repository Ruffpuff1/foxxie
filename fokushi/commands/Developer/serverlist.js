const Discord = require('discord.js');
const config = require('../../config.json')
module.exports = {
    name: 'serverlist',
    description: 'Shows the list and number of servers Fokushi is in at the moment. ',
    aliases: ['sl', 'list'],
    execute(message, args, bot) {
        if (!config.ids.developerID.includes(message.author.id)) return;
        let Embed = new Discord.MessageEmbed()
        Embed.setDescription(`${bot.guilds.cache.map(g => g.name).join(",\n")}`)
        Embed.setTimestamp()
        Embed.setColor(`Random`);
        message.channel.send(Embed)
    }
}