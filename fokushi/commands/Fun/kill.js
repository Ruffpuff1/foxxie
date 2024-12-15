const Discord = require('discord.js');
module.exports = {
    name: 'kill',
    description: 'Lets you kill someone. (Not actually)',
    execute(message, args) {
        var user = message.mentions.users.first();
        const kill= ["https://cdn.discordapp.com/attachments/802211333591793724/802562812978528256/5.gif", "https://cdn.discordapp.com/attachments/802211333591793724/802562750341185616/3.gif", "https://cdn.discordapp.com/attachments/802211333591793724/802562722675818527/0.gif", "https://cdn.discordapp.com/attachments/802211333591793724/802562816577241098/6.gif", "https://cdn.discordapp.com/attachments/802211333591793724/802562744938790952/1.gif", "https://cdn.discordapp.com/attachments/802211333591793724/802562801599905792/4.gif"];
        var url = kill[Math.floor(Math.random() * kill.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('110000')
        embed.setDescription(`**${user}** was killed by **${message.member}**`)
        embed.setImage(url)
        message.channel.send(embed)
    },
};