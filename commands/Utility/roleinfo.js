const Discord = require('discord.js');

module.exports = {
    name: 'roleinfo',
    aliases: ['rolei', 'role'],
    description: 'Shows information about that specific role.',
    execute(message, args) {
        let Embed = new Discord.MessageEmbed()
        Embed.setDescription(`
work in progress`)
        Embed.setTimestamp()
        Embed.setColor(`#2f008c`);
        message.channel.send(Embed)
    }
};