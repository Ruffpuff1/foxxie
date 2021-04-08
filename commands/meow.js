const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'meow',
    description: ' command for cats',
    async execute(message, args) {
        var user = message.mentions.users.first();
        const meow = await neko.sfw.meow();
        var url = meow[Math.floor(Math.random() * meow.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('2cdbe2')
        embed.setTitle(`cat`)
        embed.setImage(meow.url)
        message.channel.send(embed)
    }
}