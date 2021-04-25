const Discord = require('discord.js');
module.exports = {
    name: 'cry',
    description: 'Roleplay command for cry',
    execute(message, args) {
        var user = message.mentions.users.first();
        const cry= ["https://cdn.discordapp.com/attachments/802210106900873246/802561410776301669/7.gif", "https://cdn.discordapp.com/attachments/802210106900873246/802561472906919987/10.gif", "https://cdn.discordapp.com/attachments/802210106900873246/802561371019411506/4.gif", "https://cdn.discordapp.com/attachments/802210106900873246/802561339209547776/0.gif", "https://cdn.discordapp.com/attachments/802210106900873246/802561500043935754/15.gif", "https://cdn.discordapp.com/attachments/802210106900873246/802561433443368970/13.gif", "https://cdn.discordapp.com/attachments/802210106900873246/802561351980417024/2.gif", "https://cdn.discordapp.com/attachments/802210106900873246/802561490733236234/11.gif", "https://cdn.discordapp.com/attachments/802210106900873246/802561352463941663/1.gif"]
        var url = cry[Math.floor(Math.random() * cry.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('2cdbe2')
        embed.setDescription(`**${user}** is crying because of **${message.member}**`)
        embed.setImage(url)
        message.channel.send(embed)
    }
}