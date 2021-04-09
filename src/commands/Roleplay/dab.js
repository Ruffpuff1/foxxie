const Discord = require('discord.js')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'dab',
    aliases: ['epic'],
    description: 'Dab on the haters.',
    usage: `fox dab [user] (reason)`,
    guildOnly: true,
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!mentionMember) return message.channel.send("**Hey,** you needa tell me who ya wanna dab at. Try again with `fox dab [user] (reason)`")
        
        let BonkText = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.dab[Math.floor(Math.random() * gifs.dab.length)])

        embed.setDescription(`**${message.member.user.username}** dabs at **${mentionMember.user.username}**.`)    
        if (BonkText) embed.setDescription(`**${message.member.user.username}** dabs at **${mentionMember.user.username}**.\n"${BonkText}"`)

        message.channel.send(embed)
    }
}