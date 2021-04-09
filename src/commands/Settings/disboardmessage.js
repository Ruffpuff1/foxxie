const Discord = require('discord.js')
const db = require('quick.db')
module.exports = {
    name: 'disboardmessage',
    aliases: ['disboardtext', 'dm', 'disboardmsg'],
    usage: `fox disboardmessage (message)`,
    description: "Change the text I'll send ya when Disboard is off cooldown. Put 'none' to reset back to my default, or just do `fox disboardmessage` to show the current message if one is set.",
    guildOnly: true,
    permissions: 'ADMINISTRATOR',
    execute(lang, message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
        if (args[0]) {
            if (args[0].toLowerCase() === 'none') {
                db.delete(`Guilds.${message.guild.id}.Settings.Disboardmessage`)
                embed.setDescription("**Gotcha**, reset the Disboard message back to the default of mine.")
                return message.channel.send(embed)
            }
        }
        let text = args.slice(0).join(' ')
        if (!text) {
            let msg = db.get(`Guilds.${message.guild.id}.Settings.Disboardmessage`)
            if (msg === undefined) {
                embed.setDescription(`There is no Disboard message set right now, my default message is:\n\`\`\`**•** Time to bump the server on disboard. Use the command \`!d bump\` then come back in **two hours**.\`\`\`You can set your own message using the command \`fox disboardmessage (message)\``)
                return message.channel.send(embed)
            }
        embed.setDescription(`Right now the Disboard message is set to:\n\`\`\`${msg}\`\`\`If ya wanna change it, use the command \`fox disboardmessage (message)\`.`)
        return message.channel.send(embed)
        }
        db.set(`Guilds.${message.guild.id}.Settings.Disboardmessage`, text)
        embed.setDescription(`**Gotcha,** set the Disboard message to:\n\`\`\`${text}\`\`\`Now I'll send the message with my reminder embed.`)
        return message.channel.send(embed)
    }
}