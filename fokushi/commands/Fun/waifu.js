const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'waifu',
    description: 'Sends a picture of a random waifu.',
    async execute(message, args) {
        var user = message.mentions.users.first();
        const waifu = await neko.sfw.waifu();
        var url = waifu[Math.floor(Math.random() * waifu.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setDescription(`waifu`)
        embed.setImage(waifu.url)
        message.channel.send(embed)
    }
}