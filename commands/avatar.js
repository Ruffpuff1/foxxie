const Discord = require('discord.js');
module.exports = {
    name: 'avatar',
    aliases: ["av", "ava"],
    description: 'Shows a users avatar',
    execute(message, args) {
        let men;
        men = message.member
        if (args[0]) men = message.mentions.members.first() || message.guild.members.cache.find(m => m.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || 
        message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member; 
       
        let embed = new Discord.MessageEmbed()
            .setTitle(`**${men.user.tag}**, ${men.user.id === message.member.user.id ? "Your avatar." : "Their avatar."}`)
            .setTimestamp()
            .setColor('#0057ab')
            .setImage(men.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));

        message.channel.send(embed)
    }
}