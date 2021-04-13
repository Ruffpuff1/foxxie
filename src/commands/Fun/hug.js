const Discord = require('discord.js')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'hug',
    usage: `fox hug [user] (reason)`,
    category: 'fun',
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        if(!mentionMember) return message.channel.send('**Hey,** you needa tell me who ya wanna hug. Try again with \`fox hug [user] (reason)\`')
    
        let hugText = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.hug[Math.floor(Math.random() * gifs.hug.length)])

        embed.setDescription(`**${message.member.user.username}** gives a hug to **${mentionMember.user.username}**.`)    
        if (hugText) embed.setDescription(`**${message.member.user.username}** gives a hug to **${mentionMember.user.username}**.\n"${hugText}"`)

        message.channel.send(embed)
    }
}