const Discord = require('discord.js')
module.exports = {
    name: 'about',
    aliases: ['botinfo'],
    description: 'Get some basic information about me, my statistics, and some of my credits.',
    usage: 'fox about',
    category: 'utility',
    execute(lang, message, args, client) {
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.COMMAND_ABOUT_TITLE)
            .setColor(message.guild.me.displayColor)
            .setDescription(lang.COMMAND_ABOUT_SUMMARY)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: lang.COMMAND_ABOUT_CREATED,
                    value: lang.COMMAND_ABOUT_WASCREATED,
                    inline: false
                },
                {
                    name: lang.COMMAND_ABOUT_VERSION,
                    value: lang.COMMAND_ABOUT_CURRENTVER,
                    inline: false
                },
                {
                    name: lang.COMMAND_ABOUT_COMMANDS,
                    value: lang.COMMAND_ABOUT_COMMANDS_NOW,
                    inline: false
                },
                {
                    name: lang.COMMAND_ABOUT_USERS,
                    value: lang.COMMAND_ABOUT_USERS_SIZE,
                    inline: false
                },
                {
                    name: lang.COMMAND_ABOUT_GUILDS,
                    value: lang.COMMAND_ABOUT_GUILDS_SIZE,
                    inline: false
                },
                {
                    name: lang.COMMAND_ABOUT_CREDITS,
                    value: lang.COMMAND_ABOUT_CREDITS_LIST,
                    inline: false
                },
                {
                    name: lang.COMMAND_ABOUT_LINKS,
                    value: lang.COMMAND_ABOUT_LINKS_LINKS,
                    inline: false
                }
            )
        message.channel.send(embed)
    }
}