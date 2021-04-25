const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'feed',
    description: 'Roleplay command for feed',
    async execute(message, args) {
        var user = message.mentions.users.first();
        const feed = await neko.sfw.feed();
        var url = feed[Math.floor(Math.random() * feed.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setDescription(`**${user}** was fed by **${message.member}**`)
        embed.setImage(feed.url)
        message.channel.send(embed)
    }
}
