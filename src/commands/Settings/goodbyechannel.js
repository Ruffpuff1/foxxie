const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { goodbyeChannelSchema } = require('../../../lib/structures/database/schemas/server/goodbyeSchemas')
module.exports = {
    name: 'goodbyechannel',
    aliases: ['gc', 'goodbyelocation'],
    usage: 'fox goodbyeChannel [#channel]',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
        let guildId = message.guild.id
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        await mongo().then(async (mongoose) => {
            try {
                if (args[0]) {
                    if (args[0].toLowerCase() === 'none') {
                        await goodbyeChannelSchema.findByIdAndDelete({
                            _id: guildId
                        })

                        embed.setDescription(`**Got it,** removed the goodbye channel and disabled goodbye messages with this server.`)
                        return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    const results = await goodbyeChannelSchema.findById({
                        _id: guildId
                    })

                    if (results === null) {
                        embed.setDescription(`Uhhh there isn't a goodbye channel set right now. You can set one with \`fox goodbyeChannel [#channel]\`.`)
                        return message.channel.send(embed)
                    }

                    let chn = results.goodbyeChannel

                    embed.setDescription(`Right now, the goodbye channel is set to <#${chn}>. If you want to change it use \`fox goodbyeChannel [#channel]\`.`)
                    return message.channel.send(embed)
                    }

                await goodbyeChannelSchema.findByIdAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
                    goodbyeChannel: channel
                }, {
                    upsert: true
                })

                embed.setDescription(`Kk, I set the goodbye channel as ${channel} for ya. Now I'll listen for when members leave the server and send goodbye messages.`)
                return message.channel.send(embed)

            } finally {}
        })
    }
}