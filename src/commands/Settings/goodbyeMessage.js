const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { goodbyeMessageSchema } = require('../../../lib/structures/database/schemas/server/goodbyeSchemas')
module.exports = {
    name: 'goodbyemessage',
    aliases: ['goodbyetext', 'gm', 'goodbyemsg'],
    usage: `fox goodbyeMessage (message)`,
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
        const guildID = message.guild.id
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        await mongo().then(async (mongoose) => {
            try {
                if (args[0]) {
                    if (args[0].toLowerCase() === 'none') {
                        await goodbyeMessageSchema.findByIdAndDelete({
                            _id: guildID
                        })
                    
                    embed.setDescription("**Gotcha**, reset the goodbye message back to the default of mine.")
                    return message.channel.send(embed)
                    }
                }

                let text = args.slice(0).join(' ')
                if (!text) {

                    const results = await goodbyeMessageSchema.findById({
                        _id: guildID
                    })

                    if (results === null) {
                        embed.setDescription(`There is no goodbye message set right now, my default message is:\n\`\`\`{member} just left the server :(\`\`\`You can set your own message using the command \`fox goodbyemessage (message)\``)
                        return message.channel.send(embed)
                    }

                    let msg = results.goodbyeMessage

                    embed.setDescription(`Right now the goodbye message is set to:\n\`\`\`${msg}\`\`\`If ya wanna change it, use the command \`fox goodbyemessage (message)\`.`)
                    return message.channel.send(embed)
                }

                await goodbyeMessageSchema.findByIdAndUpdate({
                    _id: guildID
                }, {
                    _id: guildID,
                    goodbyeMessage: text
                }, {
                    upsert: true
                })

                embed.setDescription(`**Gotcha,** set the goodbye message to:\n\`\`\`${text}\`\`\`Now I'll send the message when someone leaves the server.`)
                message.channel.send(embed)

            } finally {}   
        })
    }
}