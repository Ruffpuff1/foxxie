const Discord = require('discord.js')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'cry',
    aliases: ['sob'],
    description: 'Cry at someone.',
    usage: `fox cry [user] (reason)`,
    guildOnly: true,
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        if(!mentionMember) return message.channel.send("**Hey,** you needa tell me who ya wanna cry at. Try again with `fox cry [user] (reason)`")
    
        let text = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.cry[Math.floor(Math.random() * gifs.cry.length)])

        embed.setDescription(`**${message.member.user.username}** cries at **${mentionMember.user.username}**.`)    
        if (text) embed.setDescription(`**${message.member.user.username}** cries at **${mentionMember.user.username}**.\n"${text}"`)

        message.channel.send(embed)
    }
}