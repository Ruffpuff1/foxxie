const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const welcomeMessageSchema = require('../../../lib/structures/database/schemas/server/welcome/welcomeMessageSchema')
module.exports = {
    name: 'welcomemessage',
    aliases: ['welcometext', 'wm', 'welcomemsg'],
    usage: `fox welcomemessage (message)`,
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
                        await welcomeMessageSchema.findByIdAndDelete({
                            _id: guildID
                        })
                    
                    embed.setDescription("**Gotcha**, reset the welcome message back to the default of mine.")
                    return message.channel.send(embed)
                    }
                }

                let text = args.slice(0).join(' ')
                if (!text) {

                    const results = await welcomeMessageSchema.findById({
                        _id: guildID
                    })

                    if (results === null) {
                        embed.setDescription(`There is no welcome message set right now, my default message is:\n\`\`\`{member} just joined the server!\`\`\`You can set your own message using the command \`fox welcomemessage (message)\``)
                        return message.channel.send(embed)
                    }

                    let msg = results.welcomeMessage

                    embed.setDescription(`Right now the welcome message is set to:\n\`\`\`${msg}\`\`\`If ya wanna change it, use the command \`fox welcomemessage (message)\`.`)
                    return message.channel.send(embed)
                }

                let welcomePing = message.mentions.roles.first()
                if (!welcomePing) welcomePing = ''

                await welcomeMessageSchema.findByIdAndUpdate({
                    _id: guildID
                }, {
                    _id: guildID,
                    welcomeMessage: text,
                    welcomePing: welcomePing
                }, {
                    upsert: true
                })

                embed.setDescription(`**Gotcha,** set the welcome message to:\n\`\`\`${text}\`\`\`Now I'll send the message when someone joins the server.`)
                message.channel.send(embed)

            } finally {}   
        })
    }
}