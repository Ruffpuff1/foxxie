const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const welcomeChannelSchema = require('../../../lib/structures/database/schemas/server/welcome/welcomeChannelSchema')
module.exports = {
    name: 'welcomechannel',
    aliases: ['wc', 'welcomelocation'],
    description: 'Set the channel where I should send welcome messages. This will initiate whenever a new member joins or you can use `fox testwelcome` to test it out beforehand.',
    usage: 'fox welcomechannel [#channel]',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
        let guildId = message.guild.id
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        await mongo().then(async (mongoose) => {
            try {
                if (args[0]) {
                    if (args[0].toLowerCase() === 'none') {
                        await welcomeChannelSchema.findByIdAndDelete({
                            _id: guildId
                        })

                        embed.setDescription(`**Got it,** removed the welcome channel and disabled welcome messages with this server.`)
                        return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    const results = await welcomeChannelSchema.findById({
                        _id: guildId
                    })

                    if (results === null) {
                        embed.setDescription(`Uhhh there isn't a welcome channel set right now. You can set one with \`fox welcomechannel [#channel]\`.`)
                        return message.channel.send(embed)
                    }

                    let chn = results.welcomeChannel

                    embed.setDescription(`Right now, the welcome channel is set to <#${chn}>. If you want to change it use \`fox welcomechannel [#channel]\`.`)
                    return message.channel.send(embed)
                    }

                await welcomeChannelSchema.findByIdAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
                    welcomeChannel: channel
                }, {
                    upsert: true
                })

                embed.setDescription(`Kk, I set the welcome channel as ${channel} for ya. Now I'll listen for when members join the server and send welcome messages.`)
                return message.channel.send(embed)

            } finally {}
        })
    }
}