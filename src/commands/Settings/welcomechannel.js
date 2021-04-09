const Discord = require('discord.js')
const db = require('quick.db')
module.exports = {
    name: 'welcomechannel',
    aliases: ['wc', 'welcomelocation'],
    description: 'Set the channel where I should send welcome messages. This will initiate whenever a new member joins or you can use `fox testwelcome` to test it out beforehand.',
    usage: 'fox welcomechannel [#channel]',
    permissions: 'ADMINISTRATOR',
    execute(lang, message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
        if (args[0]) {
            if (args[0].toLowerCase() === 'none') {
                db.delete(`Guilds.${message.guild.id}.Settings.Welcomechannel`)
                embed.setDescription(`**Got it,** removed the welcome channel and disabled welcome messages with this server.`)
                return message.channel.send(embed)
            }
        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel) {
            let chn = db.get(`Guilds.${message.guild.id}.Settings.Welcomechannel`)
            if (chn === undefined) {
                embed.setDescription(`Uhhh there isn't a welcome channel set right now. You can set one with \`fox welcomechannel [#channel]\`.`)
                return message.channel.send(embed)
            }
        embed.setDescription(`Right now, the welcome channel is set to <#${chn}>. If you want to change it use \`fox welcomechannel [#channel]\`.`)
        return message.channel.send(embed)
        }
        db.set(`Guilds.${message.guild.id}.Settings.Welcomechannel`, channel.id)
        embed.setDescription(`Kk, I set the welcome channel as ${channel} for ya. Now I'll listen for when members join the server and send welcome messages.`)
        return message.channel.send(embed)
    }
}