const Discord = require('discord.js');
module.exports = {
    name: 'serveravatar',
    aliases: ["serverav", "sa"],
    description: 'Shows the icon of the server you run the command in.',
    execute(message, args) {
        let embed = new Discord.MessageEmbed()
        embed.setColor('#006ed9')
        embed.setTitle(`${message.guild.name}'s icon.`)
        embed.setImage(message.guild.iconURL({size : 4096, dynamic: true}));

        embed.setTimestamp()
    message.channel.send(embed)
    }
}