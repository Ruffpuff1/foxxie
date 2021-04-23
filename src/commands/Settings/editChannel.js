const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/schemas')
const { serverSettings } = require('../../../lib/settings')
module.exports = {
    name: 'editchannel',
    aliases: ['ec', 'editlocation'],
    usage: 'fox editchannel (none|channel)',
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
                                editChannel: ''
                            }
                        })

                        embed.setDescription(`**Got it,** removed the edit channel and disabled edit logging with this server.`)
                        return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    let results = await serverSettings(message)

                    if (results === null || results?.editChannel == null) {
                        embed.setDescription(`Uhhh there isn't a edit channel set right now. You can set one with \`fox editChannel [#channel]\`.`)
                        return message.channel.send(embed)
                    }

                    let chn = results?.editChannel

                    embed.setDescription(`Right now, the edit channel is set to <#${chn}>. If you want to change it use \`fox editChannel [#channel]\`.`)
                    return message.channel.send(embed)
                    }

                    await serverSchema.findByIdAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        editChannel: channel
                    }, {
                        upsert: true
                    })

                embed.setDescription(`Kk, I set the edit channel as ${channel} for ya. Now I'll listen for when members edit a message, and I'll send it to this channel.`)
                return message.channel.send(embed)

            } finally {}
        })
    }
}