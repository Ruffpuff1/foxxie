const Discord = require('discord.js')
module.exports = {
    name: 'welcomechannel',
    aliases: ['wc', 'welcomelocation'],
    usage: 'fox welcomechannel (none|channel)',
    category: 'automation',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { message, args, lang, language } = props

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        if (args[0]?.toLowerCase() === 'none') {
                        
            await message.guild.settings.unset(message.guild, "welcome.channel")
            embed.setDescription(language.get('COMMAND_WELCOMECHANNEL_REMOVED', lang))
            return message.channel.send(embed)
        }

        let welcome = await message.guild.settings.get('welcome.channel')
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel) {

            if (!welcome) {
                embed.setDescription(language.get('COMMAND_WELCOMECHANNEL_NOCHANNEL', lang))
                return message.channel.send(embed)
            }

            embed.setDescription(language.get('COMMAND_WELCOMECHANNEL_NOW', lang, welcome))
            return message.channel.send(embed)
        }

        await message.guild.settings.set(message.guild, "welcome.channel", channel)
        embed.setDescription(language.get('COMMAND_WELCOMECHANNEL_SET', lang, channel))
        return message.channel.send(embed)
    }
}