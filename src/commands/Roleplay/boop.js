const Discord = require('discord.js')
const db = require('quick.db')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'boop',
    aliases: ['noseboop'],
    description: 'Boop someone on the nose.',
    usage: `fox boop [user] (reason)`,
    guildOnly: true,
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
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