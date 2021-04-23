const Discord = require('discord.js');

module.exports = {
    name: 'about',
    aliases: ['info', 'fokushi', 'foxu', 'Fokushi', 'bot'],
    description: 'Let\'s you see my story n shit.',
    execute(message, args, bot) {
        let Embed = new Discord.MessageEmbed()
        Embed.setTitle(`**ello! I'm Fokushi. Or you can call me Foxu for short.**`)
        Embed.setDescription(`I'm a very **sarcastic** bot, i was originally made by <@814539604879081532> but i was soon to have another developer called <@486396074282450946>. They're both really nice, and great dev's. I was originally a project made to be very big, but turns out both my devs have much to learn about coding. so we'll both have to wait until they're ready to release it for the public. I hope im awesome when they do! you know, i sometimes may to sarcastic or rude when responding to your commands, but I appreciate you using me and liking me. I hope to see you when im public. I love you all! 
        
My statistics 

I'm babysitting ${bot.users.cache.size} users daily.

I help out in ${bot.guilds.cache.size} servers everyday.

I can help if you shout one of my ${bot.commands.size} commands.
 
Imagine being developed by <@814539604879081532>, and <@486396074282450946>. couldn't be me, huh?

(hk help for more info)`)
        Embed.setTimestamp()
        Embed.setColor(`#0c5270`);
        message.channel.send(Embed)
        
    }
};