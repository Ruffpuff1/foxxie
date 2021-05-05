const Discord = require('discord.js')
const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/database/ServerSchemas')
module.exports = {
    name: 'prefix',
    aliases: ['setprefix'],
    usage: 'fox prefix (none|prefix)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { lang, message, args, settings } = props
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
                                prefix: ''
                            }
                        })

                        embed.setDescription(`**Got it,** removed the server's custom prefix and reset back to my default \`.\`.`)
                        return message.channel.send(embed)
                    }
                }

                let prefix = args[0]
                if (!prefix) {

                    if (settings === null || settings.prefix == null) {
                        embed.setDescription(`Uhhh there isn't a custom prefix set right now. You can set one with \`fox prefix (prefix)\` or use my defaults \`fox\` or \`.\`.`)
                        return message.channel.send(embed)
                    }

                    let chn = settings.prefix

                    embed.setDescription(`Right now, this server's prefix is set to \`${chn}\`. If you want to change it use \`fox prefix (prefix)\`.`)
                    return message.channel.send(embed)
                    }

                    await serverSchema.findByIdAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        prefix: prefix
                    }, {
                        upsert: true
                    })

                embed.setDescription(`Kk, I set the server's prefix as \`${prefix}\`. Now instead of my default, ill respond to that for commands.`)
                return message.channel.send(embed)

            } finally {}
        })
    }
}