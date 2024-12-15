const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'woof',
    description: 'Dog',
    aliases: ['dog'],
    async execute(message, args) {
        var user = message.mentions.users.first();
        const woof = await neko.sfw.woof();
        var url = woof[Math.floor(Math.random() * woof.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('2cdbe2')
        embed.setTitle(`dog`)
        embed.setImage(woof.url)
        message.channel.send(embed)
    }
}