const Discord = require('discord.js')
module.exports = {
    name: 'prefix',
    aliases: ['setprefix', 'prefixes'],
    usage: 'fox prefix (none|prefix)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { lang, message, args, language } = props
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        if (args[0]?.toLowerCase() === 'none') {
            message.guild.settings.unset(message.guild, 'prefixes');
            embed.setDescription(language.get('COMMAND_PREFIX_REMOVED', lang))
            return message.channel.send(embed)
        }

        let prefix = args[0]
        if (!prefix) {
            let prefixes = await message.guild.settings.get('prefixes')

            if (!prefixes?.length) {
                embed.setDescription(language.get('COMMAND_PREFIX_NONE', lang))
                return message.channel.send(embed)
            }

            embed.setDescription(language.get('COMMAND_PREFIX_NOW', lang, prefixes, prefixes.slice(0, -1).map(p => `\`${p}\``).join(", ")))
            return message.channel.send(embed)
        }

        message.guild.settings.push(message.guild, 'prefixes', prefix)
        embed.setDescription(language.get('COMMAND_PREFIX_ADDED', lang, prefix))
        return message.channel.send(embed)
    }
}