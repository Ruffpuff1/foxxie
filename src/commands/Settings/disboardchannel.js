const Discord = require('discord.js')
const db = require("quick.db")
module.exports = {
    name: "disboardchannel",
    aliases: ['dc', 'disboardlocation', 'bumpchannel'],
    usage: `fox disboardchannel (#channel)`,
    description: "If you use the Disboard bot you can set a channel for me to send bump reminders every two hours. Alternatively to disable these reminders you can put `fox disboardchannel none`.",
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    execute(lang, message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
        if (args[0]) {
            if (args[0].toLowerCase() === 'none') {
                db.delete(`Guilds.${message.guild.id}.Settings.Disboardchannel`)
                embed.setDescription("**Gotcha,** I'll remove the disboard reminders channel from this server.")
                return message.channel.send(embed)
            }
        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel) {
            let chn = db.get(`Guilds.${message.guild.id}.Settings.Disboardchannel`)
            if (chn === undefined) {
                embed.setDescription("There isn't a disboard channel set right now. If ya wanna set one use the command `fox disboardchannel [#channel]`")
                return message.channel.send(embed)
            }
        embed.setDescription(`Right now the Disboard channel is set to <#${chn}>. If ya wanna change it, use the command \`fox disboardchannel [#channel]\`.`)
        return message.channel.send(embed)
        }
        db.set(`Guilds.${message.guild.id}.Settings.Disboardchannel`, channel.id)
        embed.setDescription(`**Gotcha,** set the Disboard channel as ${channel}. Now I'll listen for when you send \`!d bump\` and send reminders after **two hours**.`)
        return message.channel.send(embed)
    }
}