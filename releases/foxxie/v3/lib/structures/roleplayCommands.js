const Discord = require('discord.js')
const gifs = require('./roleplayCommand')
module.exports.roleplayCommand = (msg, cmd, mem, txt, act) => {

    negativeCmd = ['shoot', 'kill', 'bonk', 'stab', 'tease']
    
    const embed = new Discord.MessageEmbed()
        .setColor(msg.guild.me.displayColor)
        .setImage(gifs[cmd][Math.floor(Math.random() * gifs[cmd].length)])
        .setDescription(`**${msg.member.user.username}** ${act} **${msg.client.user.username}**.\n"${!negativeCmd.includes(cmd)?"How sweet <3":"How could you??"}"`)


    if (mem) {
    embed.setDescription(`**${msg.member.user.username}** ${act} **${mem.user.username}**.`)
    if (txt) embed.setDescription(`**${msg.member.user.username}** ${act} **${mem.user.username}**.\n"${txt}"`)
    }

    msg.channel.send(embed)
}