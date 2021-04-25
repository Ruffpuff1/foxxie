const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'slap',
    description: 'Roleplay command for slap',
    async execute(message, args) {
        var user = message.mentions.users.first();
        const slap = await neko.sfw.slap();
        var url = slap[Math.floor(Math.random() * slap.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('2cdbe2')
        embed.setDescription(`**${user}** was slapped by **${message.member}**`)
        embed.setImage(slap.url)
        message.channel.send(embed)
    }
}