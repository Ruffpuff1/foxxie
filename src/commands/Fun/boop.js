const Discord = require('discord.js')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'boop',
    aliases: ['noseboop'],
    usage: `fox boop [user] (reason)`,
    category: 'fun',
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        if(!mentionMember) return message.channel.send("**Hey,** you needa tell me who ya wanna boop on the nose. Try again with `fox boop [user] (reason)`")
        
        let BonkText = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.boop[Math.floor(Math.random() * gifs.boop.length)])

        embed.setDescription(`**${message.member.user.username}** boops **${mentionMember.user.username}** on the nose.`)    
        if (BonkText) embed.setDescription(`**${message.member.user.username}** boops **${mentionMember.user.username}** on the nose.\n"${BonkText}"`)

        message.channel.send(embed)
    }
}