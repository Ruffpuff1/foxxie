const Discord = require('discord.js')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'pat',
    aliases: ['headpat'],
    description: 'Give someone headpats.',
    usage: `fox pat [user] (reason)`,
    guildOnly: true,
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!mentionMember) return message.channel.send('**Hey,** you needa tell me who ya wanna pat. Try again with \`fox pat [user] (reason)\`')
        
        let patText = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.pat[Math.floor(Math.random() * gifs.pat.length)])

        embed.setDescription(`**${message.member.user.username}** gives a headpat to **${mentionMember.user.username}**.`)    
        if (patText) embed.setDescription(`**${message.member.user.username}** gives a headpat to **${mentionMember.user.username}**.\n"${patText}"`)

        message.channel.send(embed)
    }
}