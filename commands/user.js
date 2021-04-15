const Discord = require('discord.js');
const moment = require('moment')

module.exports = {
    name: 'user',
    aliases: ["userinfo", "ui", "usr"],
    description: 'Shows info about the specified user. ',
    
    execute(message, args) {
        let men;
        men = message.member
        if (args[0]) men = message.mentions.members.first() || message.guild.members.cache.find(m => m.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || 
        message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member; 
        
        let embed = new Discord.MessageEmbed()
            .setTitle(` **${men.user.tag}**, ${men.user.id === message.member.user.id ? "Info about you." : "Info about them."}`)
            .setColor('#3d9fff')
            .setThumbnail(men.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096}))
            .setTimestamp()
            .setFooter('WOOOOOOOOOOOOOOOOOOO', men.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096}))


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

${men.user.presence.status === "online"?"<:SROnline:831122923728535582>"
: men.user.presence.status === "idle"?"<:SRIdle:831122864203759657>"
: men.user.presence.status === "dnd"?"<:SRDnd:831111495076675594>"
: men.user.presence.status === "offline"?"<:SROffline:831122726751567892>":"<:SROffline:831122726751567892>"} **Status**: ${men.user.presence.status}

    :butterfly: **Custom status**: ${men.user.presence.activities ? `${men.user.presence?.activities[0]["name"] === "Custom Status"
                                                                                                                            ? men.user.presence?.activities[0]["state"] 
                                                                                                                            : men.user.presence?.activities[0]["name"] 
                                                               }` : "none"}

`)

            
            message.channel.send(embed)
}
    }
