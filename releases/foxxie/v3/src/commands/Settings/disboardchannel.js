const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/schemas')
const { serverSettings } = require('../../../lib/settings')
module.exports = {
    name: "disboardchannel",
    aliases: ['dc', 'disboardlocation', 'bumpchannel'],
    usage: `fox disboardchannel (none|channel)`,
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        await mongo().then(async (mongoose) => {
            try {
                if (args[0]) {
                    if (args[0].toLowerCase() === 'none') {
                        await serverSchema.findByIdAndUpdate({
                            _id: message.guild.id
                        }, {
                            _id: message.guild.id,
                            $unset: {
                                disboardChannel: ''
                            }
                        })

                    embed.setDescription("**Gotcha,** I'll remove the disboard reminders channel from this server.")
                    return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    let results = await serverSettings(message)

                    if (results === null || results.disboardChannel == null) {
                        embed.setDescription("There isn't a disboard channel set right now. If ya wanna set one use the command `fox disboardchannel [#channel]`")
                        return message.channel.send(embed)
                    }

                    let chn = results.disboardChannel
 
                    embed.setDescription(`Right now the Disboard channel is set to <#${chn}>. If ya wanna change it, use the command \`fox disboardchannel [#channel]\`.`)
                    return message.channel.send(embed)
                    }

                await serverSchema.findByIdAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    disboardChannel: channel
                }, {
                    upsert: true
                })

                embed.setDescription(`**Gotcha,** set the Disboard channel as ${channel}. Now I'll listen for when you send \`!d bump\` and send reminders after **two hours**.`)
                return message.channel.send(embed)

            } finally {}
        })
    }
}