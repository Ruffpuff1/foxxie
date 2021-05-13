const Discord = require('discord.js')
module.exports = {
    name: 'welcomemessage',
    aliases: ['welcometext', 'wm', 'welcomemsg'],
    usage: `fox welcomemessage (none|message)`,
    category: 'automation',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { message, args, lang, language } = props

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        if (args[0]?.toLowerCase() === 'none') {
                        
            await message.guild.settings.unset(message.guild, "welcome.message")
            embed.setDescription(language.get('COMMAND_WELCOMEMESSAGE_REMOVED', lang))
            return message.channel.send(embed)
        }

        let msg = await message.guild.settings.get('welcome.message');
        let text = args.slice(0).join(' ')

        if (!text) {

            if (!msg) {
                embed.setDescription(language.get('COMMAND_WELCOMEMESSAGE_NOMESSAGE', lang))
                return message.channel.send(embed)
            }

            embed.setDescription(language.get('COMMAND_WELCOMEMESSAGE_NOW', lang, msg))
            return message.channel.send(embed)
        }

        await message.guild.settings.set(message.guild, "welcome.message", text)
        embed.setDescription(language.get('COMMAND_WELCOMEMESSAGE_SET', lang, text))
        return message.channel.send(embed);
    }
}