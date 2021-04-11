const Discord = require('discord.js')
const db = require('quick.db')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'bonk',
    aliases: ['bop'],
    description: 'Hit someone on the head.',
    usage: `fox bonk [user] (reason)`,
    guildOnly: true,
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        if(!mentionMember) return message.channel.send("**Hey,** you needa tell me who ya wanna hit on the head. Try again with `fox bonk [user] (reason)`")
    
        let BonkText = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.bonk[Math.floor(Math.random() * gifs.bonk.length)])

        embed.setDescription(`**${message.member.user.username}** bonks **${mentionMember.user.username}**.`)    
        if (BonkText) embed.setDescription(`**${message.member.user.username}** bonks **${mentionMember.user.username}**.\n"${BonkText}"`)

        message.channel.send(embed)
    }
}