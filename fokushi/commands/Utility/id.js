const Discord = require('discord.js');
module.exports = {
    name: 'id',
    aliases: ["ID"],
    description: 'Shows specified users ID or your own.',
    execute(message, args) {
        const men = message.mentions.members.first() || message.guild.members.cache.find(m => m.displayName == args[0]) || 
message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag == args[0]) 
        if(!men){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${message.author.username}, your ID.
            
ID: ${message.author.id} `)
            embed.setColor('#2694ff')

            message.channel.send(embed)
        } else { 
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${men.user.tag}, their ID. 

ID: ${men.user.id}`)
embed.setColor('#2694ff')
            message.channel.send(embed)
        }
    }
}