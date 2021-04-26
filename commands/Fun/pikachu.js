const Discord = require('discord.js');

module.exports = {
    name: 'pikachu',
    aliases: ['pika', 'pikapika'],
    description: 'pika pika.',
    execute(message, args) {
        let Embed = new Discord.MessageEmbed()
        Embed.setImage(`https://images-ext-1.discordapp.net/external/ssgTbUpw1ngMy0j24_jWB1ZYZLAnsUmyyWd99AA7kbg/https/media.discordapp.net/attachments/713900746201890896/830949617607770132/image0.gif`)
        Embed.setColor(`YELLOW`);
        message.channel.send(Embed)
    }
};