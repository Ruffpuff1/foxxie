const Discord = require('discord.js')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'facepalm',
    aliases: ['dumb'],
    usage: `fox boop [user] (reason)`,
    category: 'fun',
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        if(!mentionMember) return message.channel.send("**Hey,** you needa tell me who ya wanna facepalm at. Try again with `fox facepalm [user] (reason)`")
        
        let BonkText = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.facepalm[Math.floor(Math.random() * gifs.facepalm.length)])

        embed.setDescription(`**${message.member.user.username}** facepalms at **${mentionMember.user.username}**.`)    
        if (BonkText) embed.setDescription(`**${message.member.user.username}** facepalms at **${mentionMember.user.username}**.\n"${BonkText}"`)

        message.channel.send(embed)
    }
}