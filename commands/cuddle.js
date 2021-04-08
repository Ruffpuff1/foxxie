const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'cuddle',
    description: 'Roleplay command for cuddle',
    async execute(message, args) {
        var user = message.mentions.users.first();
        const cuddle = await neko.sfw.cuddle();
        var url = cuddle[Math.floor(Math.random() * cuddle.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setDescription(`**${message.member.displayName}** is cuddling **${message.member.displayName}**`)
        embed.setImage(cuddle.url)
        message.channel.send(embed)
    }
}