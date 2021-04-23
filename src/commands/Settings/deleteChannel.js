const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/schemas')
const { serverSettings } = require('../../../lib/settings')
module.exports = {
    name: 'deletechannel',
    aliases: ['dlc', 'deletelocation'],
    usage: 'fox deletechannel (none|channel)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
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
                                deleteChannel: ''
                            }
                        })

                        embed.setDescription(`**Got it,** removed the delete channel and disabled delete logging with this server.`)
                        return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    let results = await serverSettings(message)

                    if (results === null || results?.deleteChannel == null) {
                        embed.setDescription(`Uhhh there isn't a welcome channel set right now. You can set one with \`fox deleteChannel [#channel]\`.`)
                        return message.channel.send(embed)
                    }

                    let chn = results?.deleteChannel

                    embed.setDescription(`Right now, the welcome channel is set to <#${chn}>. If you want to change it use \`fox deleteChannel [#channel]\`.`)
                    return message.channel.send(embed)
                    }

                    await serverSchema.findByIdAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        deleteChannel: channel
                    }, {
                        upsert: true
                    })

                embed.setDescription(`Kk, I set the delete channel as ${channel} for ya. Now I'll listen for when members delete a message, and I'll send it to this channel.`)
                return message.channel.send(embed)

            } finally {}
        })
    }
}