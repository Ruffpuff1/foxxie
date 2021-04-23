const config = require('../config.json')
const Discord = require('discord.js')
module.exports = {
	name: 'messageUpdate',
	execute(oldMessage, newMessage, bot) {
        
        function logMessageEdit (channel){
            const logChannel = bot.channels.cache.get(channel)
            const Embed = new Discord.MessageEmbed()
                .setColor('#ff7a4a')
                .setTitle(`Message Edited.`)
                .setTimestamp()
                .setFooter('why are you reading this lmao')
                .setDescription(`A message was Edited.
    
The Before Message:
    
***${oldMessage.content}***
    
The After Message:
    
***${newMessage.content}***
    
The Location:
    
${oldMessage.channel}
    
The Author:
    
**${oldMessage.author.tag}**`)
        
        logChannel.send(Embed)
        }

        if (oldMessage.guild.id === config.seasideRest) logMessageEdit("828563803532296252")
        if (oldMessage.guild.id === config.ok) logMessageEdit("831410626098102284")
	},
};