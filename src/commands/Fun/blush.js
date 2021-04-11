const Discord = require('discord.js')
const gifs = require('../../../lib/structures/roleplayCommand')
module.exports = {
    name: 'blush',
    aliases: ['happy', 'smile'],
    description: 'Blush at someone.',
    usage: `fox blush [user] (reason)`,
    guildOnly: true,
    execute(lang, message, args) {
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        if(!mentionMember) return message.channel.send("**Hey,** you needa tell me who ya wanna blush at. Try again with `fox blush [user] (reason)`")
    
        let text = args.slice(1).join(' ');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setImage(gifs.blush[Math.floor(Math.random() * gifs.blush.length)])

        embed.setDescription(`**${message.member.user.username}** blushes at **${mentionMember.user.username}**.`)    
        if (text) embed.setDescription(`**${message.member.user.username}** blushes at **${mentionMember.user.username}**.\n"${text}"`)

        message.channel.send(embed)
    }
}