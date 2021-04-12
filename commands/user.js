const Discord = require('discord.js');
const moment = require('moment')

module.exports = {
    name: 'user',
    aliases: ["userinfo", "ui", "usr"],
    description: 'Shows info about the specified user. ',
    
    execute(message, args, bot) {
        bot.users.cache.find(r => r.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        const men = message.mentions.members.first() || message.guild.members.cache.find(m => m.displayName == args[0]) || 
message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag == args[0]) 
        if(!men){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(` **${message.author.tag}**, Info about you.`)
            embed.setDescription(`
:crown: **Display name:** ${message.member}  

:id: **User ID**: ${message.author.id}

:scroll: **Roles:** ${message.member.roles.cache 
                .sort((a, b) => b.position - a.position)
                .map(r => r)
                .join(", ")
                .replace(", @everyone", " ")}
                
:calendar: **Joined at:** ${moment(message.member.joinedAt).format('MMMM Do YYYY')} **(${moment([moment(message.member.joinedAt).format('YYYY'), moment(message.member.joinedAt).format('M') - 1, moment(message.member.joinedAt).format('D')]).toNow(true)} ago)** 

:calendar: **Created at:** ${moment(message.member.user.createdAt).format('MMMM Do YYYY')} **(${moment([moment(message.member.user.createdAt).format('YYYY'), moment(message.member.user.createdAt).format('M') - 1, moment(message.member.user.createdAt).format('D')]).toNow(true)} ago)**

:arrow_double_up: **Highest role**: ${message.member.roles.highest.name}

<:SRDnd:831111495076675594> **Status**: ${message.member.user.presence.status}
`)
          
            embed.setColor('#3d9fff')
            embed.setThumbnail(message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
            embed.setTimestamp()
            embed.setFooter('WOOOOOOOOOOOOOOOOOOOO', message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
            message.channel.send(embed)
    } else {
        let embed = new Discord.MessageEmbed();
            embed.setTitle(` **${men.user.tag}**, Info about them.`)
            embed.setDescription(`
:crown: **Display name:** ${men}  

:id: **User ID**: ${men.user.id}

:scroll: **Roles:** ${men.roles.cache 
    .sort((a, b) => b.position - a.position)
    .map(r => r)
    .join(", ")
    .replace(", @everyone", " ")}
    
    :calendar: **Joined at:** ${moment(men.joinedAt).format('MMMM Do YYYY')} **(${moment([moment(men.joinedAt).format('YYYY'), moment(men.joinedAt).format('M') - 1, moment(men.joinedAt).format('D')]).toNow(true)} ago)** 

    :calendar: **Created at:** ${moment(men.user.createdAt).format('MMMM Do YYYY')} **(${moment([moment(men.user.createdAt).format('YYYY'), moment(men.user.createdAt).format('M') - 1, moment(men.user.createdAt).format('D')]).toNow(true)} ago)**
    
    :arrow_double_up: **Highest role**: ${men.roles.highest.name}

    <:SRDnd:831111495076675594> **Status**: ${men.user.presence.status}

`)
            
            embed.setColor('#3d9fff')
            embed.setThumbnail(men.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
            embed.setTimestamp()
            embed.setFooter('WOOOOOOOOOOOOOOOOOOO', men.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
            message.channel.send(embed)
}
    }
}
