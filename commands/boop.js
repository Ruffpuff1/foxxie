const Discord = require('discord.js');
const gif = require('nekos.life');
const neko = new gif;
module.exports = {
    name: 'boop',
    description: 'Roleplay command for boop',
    async execute(message, args) {
        var user = message.mentions.users.first();
        const poke = await neko.sfw.poke();
        var url = poke[Math.floor(Math.random() * poke.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setDescription(`**${user}** was booped by **${message.member}**`)
        embed.setImage(poke.url)
        message.channel.send(embed)
    }
}
