const Discord = require('discord.js');
module.exports = {
    name: 'avatar',
    aliases: ["av", "ava"],
    description: 'Shows a users avatar ',
    execute(message, args, bot) {
        bot.users.cache.find(r => r.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        const men =  message.mentions.members.first() || message.guild.members.cache.find(m => m.displayName == args[0]) || 
message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag == args[0]) 
        if(!men){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${message.author.username}, your avatar.
i hope you like it.

(ID: ${message.author.id}) `)
            embed.setColor('#000000')
            embed.setTimestamp()
            embed.setImage(message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
            message.channel.send(embed)
        } else { 
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${men.user.tag}, their avatar. 
i hope you like it. 

(ID: ${men.user.id})`)
embed.setTimestamp()
            embed.setImage(men.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
            message.channel.send(embed)
        }
    }
}