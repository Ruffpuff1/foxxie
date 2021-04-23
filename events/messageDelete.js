const config = require('../config.json')
const Discord = require('discord.js')
module.exports = {
	name: 'messageDelete',
	execute(messageDelete, bot) {
        
        function logMessageEdit (channel){
            const staffchannel = bot.channels.cache.get(channel)
            const Embed = new Discord.MessageEmbed()
                .setColor('#f55a22')
                .setTitle(`Message Deleted.`)
                .setTimestamp()
                .setFooter('why are you reading this lmao')
                .setDescription(`A message was deleted.

The Message:

***${messageDelete.content}***

Location:

${messageDelete.channel}

The Author:

**${messageDelete.author.tag}** `)

    staffchannel.send(Embed)
        }

        if (oldMessage.guild.id === config.seasideRest) logMessageEdit("828563803532296252")
        if (oldMessage.guild.id === config.ok) logMessageEdit("831410626098102284")
	},
};