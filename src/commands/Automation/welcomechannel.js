const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/database/ServerSchemas')
const { serverSettings } = require('../../../lib/settings')
module.exports = {
    name: 'welcomechannel',
    aliases: ['wc', 'welcomelocation'],
    usage: 'fox welcomechannel (none|channel)',
    category: 'automation',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
        let guildId = message.guild.id
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
                                welcomeChannel: ''
                            }
                        })

                        embed.setDescription(`**Got it,** removed the welcome channel and disabled welcome messages with this server.`)
                        return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    let results = await serverSettings(message)

                    if (results === null || results.welcomeChannel == null) {
                        embed.setDescription(`Uhhh there isn't a welcome channel set right now. You can set one with \`fox welcomechannel [#channel]\`.`)
                        return message.channel.send(embed)
                    }

                    let chn = results.welcomeChannel

                    embed.setDescription(`Right now, the welcome channel is set to <#${chn}>. If you want to change it use \`fox welcomechannel [#channel]\`.`)
                    return message.channel.send(embed)
                    }

                    await serverSchema.findByIdAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
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