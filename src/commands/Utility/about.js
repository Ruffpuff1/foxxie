const Discord = require('discord.js')
module.exports = {
    name: 'about',
    aliases: ['botinfo'],
    usage: 'fox about',
    category: 'utility',
    execute(props) {

        let { lang, message, args } = props;

        const embed = new Discord.MessageEmbed()
            .setTitle(lang.COMMAND_ABOUT_TITLE)
            .setColor(message.guild.me.displayColor)
            .setDescription(lang.COMMAND_ABOUT_SUMMARY)
            .setThumbnail(message.client.user.displayAvatarURL())
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
                    value: `**•** Right now I'm cleaning up after **${message.client.users.cache.size}** users.`,
                    inline: false
                },
                {
                    name: lang.COMMAND_ABOUT_GUILDS,
                    value: `**•** I'm looking after **${message.client.guilds.cache.size}** servers.`,
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