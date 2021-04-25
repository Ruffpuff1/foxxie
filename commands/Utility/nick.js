const Discord = require('discord.js');
module.exports = {
    name: 'nick',
    description: 'Lets you request a nickname if you dont have the perms for it :/',
    aliases: ['nickname', 'name'],
    execute(message, args, bot) {
        message.delete();
        if (message.guild.id !== config.servers.seasideRest) return
        let nickchannel = bot.channels.cache.get("822187934714167363")
        let text = args.slice(0).join(' ');
        if (!text) return;
        let Embed = new Discord.MessageEmbed()
        Embed.setDescription(`${text}`)
        Embed.setTimestamp()
        Embed.setFooter(`${message.author.tag}`)
        Embed.setColor(`Random`);
        
        nickchannel.send(Embed)
    }
}

