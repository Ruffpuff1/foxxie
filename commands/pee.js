const Discord = require('discord.js');
module.exports = {
    name: 'pee',
    aliases: ["p"],
    description: 'pee on someone ',
    execute(message, args) {
        const men = message.mentions.members.first() || message.guild.members.cache.find(m => m.displayName == args[0]) || 
message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag == args[0]) 
        if(!men){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${message.author.username} is peeing`)
            embed.setColor('#1ec74b')

            message.channel.send(embed)
        } else { 
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${message.author.username} is peeing on ${men.user.username} `)
            message.channel.send(embed)
        }
    }
}