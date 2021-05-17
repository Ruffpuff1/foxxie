const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/database/ServerSchemas')
module.exports = {
    name: 'goodbyechannel',
    aliases: ['gc', 'goodbyelocation'],
    usage: 'fox goodbyeChannel (none|channel)',
    //category: 'settings',
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
                                goodbyeChannel: ''
                            }
                        })
                        embed.setDescription(`**Got it,** removed the goodbye channel and disabled goodbye messages with this server.`)
                        return message.channel.send(embed)
                    }
                }

                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {

                    if (settings === null || settings.goodbyeChannel == null) {
                        embed.setDescription(`Uhhh there isn't a goodbye channel set right now. You can set one with \`fox goodbyeChannel [#channel]\`.`)
                        return message.channel.send(embed)
                    }

                    let chn = settings.goodbyeChannel

                    embed.setDescription(`Right now, the goodbye channel is set to <#${chn}>. If you want to change it use \`fox goodbyeChannel [#channel]\`.`)
                    return message.channel.send(embed)
                    }

                    await serverSchema.findByIdAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
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