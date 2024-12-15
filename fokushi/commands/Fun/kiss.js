const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'kiss',
    description: 'Lets you kiss someone.',
    async execute(message, args) {
        var user = message.mentions.users.first();
        const kiss = await neko.sfw.kiss();
        var url = kiss[Math.floor(Math.random() * kiss.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setDescription(`**${user}** was kissed by **${message.member}**`)
        embed.setImage(kiss.url)
        message.channel.send(embed)
    }
}
