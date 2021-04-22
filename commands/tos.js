const Discord = require('discord.js');

module.exports = {
    name: 'tos',
    aliases: ['ToS', 'terms', 'term', 'termsofservice'],
    description: 'Let\'s you see my ToS easily..',
    execute(message, args, bot) {
        let Embed = new Discord.MessageEmbed()
        Embed.setTitle(`Fokushi's Terms of Service.`)
        Embed.setDescription(`not written yet lol`)
        Embed.setTimestamp()
        Embed.setColor(`RANDOM`);
        message.channel.send(Embed)
        
    }
};