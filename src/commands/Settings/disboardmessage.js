const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const disboardMessageSchema = require('../../../lib/structures/database/schemas/server/disboard/disboardMessageSchema')
module.exports = {
    name: 'disboardmessage',
    aliases: ['disboardtext', 'dm', 'disboardmsg'],
    usage: `fox disboardmessage (message)`,
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) =>{
        const guildID = message.guild.id
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        await mongo().then(async (mongoose) => {
            try {
                if (args[0]) {
                    if (args[0].toLowerCase() === 'none') {
                        await disboardMessageSchema.findByIdAndDelete({
                            _id: guildID
                        })
                    
                    embed.setDescription("**Gotcha**, reset the Disboard message back to the default of mine.")
                    return message.channel.send(embed)
                    }
                }

                let text = args.slice(0).join(' ')
                if (!text) {

                    const results = await disboardMessageSchema.findById({
                        _id: guildID
                    })

                    if (results === null) {
                        embed.setDescription(`There is no Disboard message set right now, my default message is:\n\`\`\`**•** Time to bump the server on disboard. Use the command \`!d bump\` then come back in **two hours**.\`\`\`You can set your own message using the command \`fox disboardmessage (message)\``)
                        return message.channel.send(embed)
                    }

                    let msg = results.disboardMessage

                    embed.setDescription(`Right now the Disboard message is set to:\n\`\`\`${msg}\`\`\`If ya wanna change it, use the command \`fox disboardmessage (message)\`.`)
                    return message.channel.send(embed)
                }

                let disboardPing = message.mentions.roles.first()
                if (!disboardPing) disboardPing = ''

                await disboardMessageSchema.findByIdAndUpdate({
                    _id: guildID
                }, {
                    _id: guildID,
                    disboardMessage: text,
                    disboardPing: disboardPing
                }, {
                    upsert: true
                })

                embed.setDescription(`**Gotcha,** set the Disboard message to:\n\`\`\`${text}\`\`\`Now I'll send the message with my reminder embed.`)
                message.channel.send(embed)

            } finally {}   
        })
    }
}