const Discord = require('discord.js');
module.exports = {
    name: 'nick',
    description: 'Lets you request a nickname :/',
    aliases: ['nickname', 'name'],
    execute(message, args, bot) {
        message.delete();
        if (message.guild.id !== config.seasideRest) return
        let nickchannel = bot.channels.cache.get("831305968163094549")
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