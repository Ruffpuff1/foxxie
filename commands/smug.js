const Discord = require('discord.js');
module.exports = {
    name: 'smug',
    description: 'Roleplay command for smug',
    execute(message, args) {
        var user = message.mentions.users.first();
        const smug= ["https://media1.tenor.com/images/6fcfbab36f6d2c578abd6228d1e74231/tenor.gif?itemid=9810121", "https://media1.tenor.com/images/daa1824574947530e1a86fd4f0b74761/tenor.gif?itemid=13940350", "https://media1.tenor.com/images/daa1824574947530e1a86fd4f0b74761/tenor.gif?itemid=13940350", "https://media1.tenor.com/images/1fe93596a8a0f84078b936305b319c55/tenor.gif?itemid=6194051", "https://media1.tenor.com/images/1fe93596a8a0f84078b936305b319c55/tenor.gif?itemid=6194051", "https://media1.tenor.com/images/7a72632f2d105bd91166432e8ad642db/tenor.gif?itemid=13598614"]
        var url = smug[Math.floor(Math.random() * smug.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('2cdbe2')
        embed.setDescription(`**${message.member}** is smirking.`)
        embed.setImage(url)
        message.channel.send(embed)
    }
}