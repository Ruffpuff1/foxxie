const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'goose',
    description: 'Goose',
    async execute(message, args) {
        var user = message.mentions.users.first();
        const goose = await neko.sfw.goose();
        var url = goose[Math.floor(Math.random() * goose.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('2cdbe2')
        embed.setTitle(`goose`)
        embed.setImage(goose.url)
        message.channel.send(embed)
    }
}