const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/database/ServerSchemas')
module.exports = {
    name: 'goodbyemessage',
    aliases: ['goodbyetext', 'gm', 'goodbyemsg'],
    usage: `fox goodbyemessage (none|message)`,
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { message, args } = props

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        await mongo().then(async () => {
            try {
                if (args[0]) {
                    if (args[0].toLowerCase() === 'none') {
                        await serverSchema.findByIdAndUpdate({
                            _id: message.guild.id
                        }, {
                            _id: message.guild.id,
                            $unset: {
                                goodbyeMessage: ''
                            }
                        })
                    
                    embed.setDescription("**Gotcha**, reset the goodbye message back to the default of mine.")
                    return message.channel.send(embed)
                    }
                }

                let text = args.slice(0).join(' ')
                if (!text) {

                    if (settings === null || settings.goodbyeMessage == null) {
                        embed.setDescription(`There is no goodbye message set right now, my default message is:\n\`\`\`**{member}** just left the server :(\`\`\`You can set your own message using the command \`fox goodbyemessage (message)\``)
                        return message.channel.send(embed)
                    }

                    let msg = settings.goodbyeMessage

                    embed.setDescription(`Right now the goodbye message is set to:\n\`\`\`${msg}\`\`\`If ya wanna change it, use the command \`fox goodbyemessage (message)\`.`)
                    return message.channel.send(embed)
                }

                await serverSchema.findByIdAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    goodbyeMessage: text
                }, {
                    upsert: true
                })

                embed.setDescription(`**Gotcha,** set the goodbye message to:\n\`\`\`${text}\`\`\`Now I'll send the message with my goodbye logging.`)
                message.channel.send(embed)

            } finally {}   
        })
    }
}