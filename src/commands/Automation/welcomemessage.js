const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/database/ServerSchemas')
module.exports = {
    name: 'welcomemessage',
    aliases: ['welcometext', 'wm', 'welcomemsg'],
    usage: `fox welcomemessage (none|message)`,
    category: 'automation',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { message, args, settings } = props

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
                                welcomeMessage: ''
                            }
                        })
                    
                    embed.setDescription("**Gotcha**, reset the welcome message back to the default of mine.")
                    return message.channel.send(embed)
                    }
                }

                let text = args.slice(0).join(' ')
                if (!text) {

                    if (settings === null || settings.welcomeMessage == null) {
                        embed.setDescription(`There is no welcome message set right now, my default message is:\n\`\`\`**{member}** just joined the server!\`\`\`You can set your own message using the command \`fox welcomemessage (message)\``)
                        return message.channel.send(embed)
                    }

                    let msg = settings.welcomeMessage

                    embed.setDescription(`Right now the welcome message is set to:\n\`\`\`${msg}\`\`\`If ya wanna change it, use the command \`fox welcomemessage (message)\`.`)
                    return message.channel.send(embed)
                }

                await serverSchema.findByIdAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    welcomeMessage: text
                }, {
                    upsert: true
                })

                embed.setDescription(`**Gotcha,** set the welcome message to:\n\`\`\`${text}\`\`\`Now I'll send the message with my welcome logging.`)
                message.channel.send(embed)

            } finally {}   
        })
    }
}