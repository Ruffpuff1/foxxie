const Discord = require('discord.js');

module.exports = {
    name: 'status',
    aliases: ['s', 'stats'],
    description: 'My current status.',
    execute(message, args) {
if (!config.ids.developerID.includes(message.author.id)) return;
let Embed = new Discord.MessageEmbed()

Embed.setDescription(`
Hi! This is my current status.
Version: ${config.botver}
Users: ${bot.users.cache.size}

Everything seems to be fine.`)
Embed.setTimestamp()
Embed.setColor(`GREY`);
message.channel.send(Embed)
    }
};