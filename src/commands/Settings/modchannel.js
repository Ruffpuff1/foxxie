const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/schemas')
const { serverSettings } = require('../../../lib/settings')
module.exports = {
    name: 'modchannel',
    aliases: ['mc', 'modlogs'],
    usage: 'fox modchannel (none|channel)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
        
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);

        await mongo().then(async (mongoose) => {
            try {
                if (args[0]) {
                    if (args[0].toLowerCase() === 'none') {
                        await serverSchema.findByIdAndUpdate({
                            _id: message.guild.id
                        }, {
                            _id: message.guild.id,
                            $unset: {
                                modChannel: ''
                            }
                        })

                    embed.setDescription(`**Got it,** removed the modchannel and disabled moderation logging with this server.`)
                    loading.delete()
                    return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    let results = await serverSettings(message)

                    if (results === null || results?.modChannel == null) {
                        embed.setDescription(`Uhhh there isn't a modchannel set right now. You can set one with \`fox modchannel [#channel]\`.`)
                        loading.delete()
                        return message.channel.send(embed)
                    }

                    let chn = results?.modChannel

                    embed.setDescription(`Right now, the modchannel is set to <#${chn}>. If you want to change it use \`fox modchannel [#channel]\`.`)
                    loading.delete()
                    return message.channel.send(embed)
                }
        
                await serverSchema.findByIdAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    modChannel: channel
                }, {
                    upsert: true
                })

                embed.setDescription(`Kk, I set the modchannel as ${channel} for ya. Now I'll listen for when moderation actions are taken and I'll log them.`)
                loading.delete()
                return message.channel.send(embed)

            } finally {}
        })
    }
}