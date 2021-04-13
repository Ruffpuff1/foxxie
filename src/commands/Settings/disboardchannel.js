const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const disboardChannelSchema = require('../../../lib/structures/database/schemas/server/disboard/disboardChannelSchema')
module.exports = {
    name: "disboardchannel",
    aliases: ['dc', 'disboardlocation', 'bumpchannel'],
    usage: `fox disboardchannel (#channel)`,
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
        const guildId = message.guild.id
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        await mongo().then(async (mongoose) => {
            try {
                if (args[0]) {
                    if (args[0].toLowerCase() === 'none') {
                        await disboardChannelSchema.findByIdAndDelete({
                            _id: guildId
                        })

                    embed.setDescription("**Gotcha,** I'll remove the disboard reminders channel from this server.")
                    return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    const results = await disboardChannelSchema.findById({
                        _id: guildId
                    })

                    if (results === null) {
                        embed.setDescription("There isn't a disboard channel set right now. If ya wanna set one use the command `fox disboardchannel [#channel]`")
                        return message.channel.send(embed)
                    }

                    let chn = results.disboardChannel
 
                    embed.setDescription(`Right now the Disboard channel is set to <#${chn}>. If ya wanna change it, use the command \`fox disboardchannel [#channel]\`.`)
                    return message.channel.send(embed)
                    }

                await disboardChannelSchema.findByIdAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
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