const Discord = require('discord.js');

module.exports = {
    name: 'about',
    aliases: ['info', 'fokushi', 'foxu', 'Fokushi', 'bot'],
    description: 'Let\'s you see my story n shit.',
    execute(message, args, bot) {
        let Embed = new Discord.MessageEmbed()
        Embed.setDescription(`ooga booga for now. this command will be updated soon, please be patient.`)
        Embed.setTimestamp()
        Embed.setColor(`RANDOM`);
        message.channel.send(Embed)
        
    }
};