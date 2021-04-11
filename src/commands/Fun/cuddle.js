const Discord = require('discord.js')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'cuddle',
    description: 'Cuddle with your friends.',
    usage: `fox cuddle [user] (reason)`,
    guildOnly: true,
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        if(!mentionMember) return message.channel.send('**Hey,** you needa tell me who ya wanna cuddle. Try again with `fox cuddle [user] (reason)`')
        
        let cuddleText = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.cuddle[Math.floor(Math.random() * gifs.cuddle.length)])

        embed.setDescription(`**${message.member.user.username}** cuddles with **${mentionMember.user.username}**.`)    
        if (cuddleText) embed.setDescription(`**${message.member.user.username}** cuddles with **${mentionMember.user.username}**.\n"${cuddleText}"`)

        message.channel.send(embed)
    }
}