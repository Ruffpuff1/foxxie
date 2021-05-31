const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
    name: 'about',
    aliases: ['botinfo'],
    usage: 'fox about',
    category: 'utility',
    execute(props) {

        let { lang, message, language } = props;

        const embed = new Discord.MessageEmbed()
            .setTitle(language.get('COMMAND_ABOUT_TITLE', lang))
            .setColor(message.guild.me.displayColor)
            .setDescription(language.get('COMMAND_ABOUT_SUMMARY', lang))
            .setThumbnail(message.client.user.displayAvatarURL())
            .addField(language.get('COMMAND_ABOUT_CREATED_TITLE', lang), language.get('COMMAND_ABOUT_CREATED_VALUE', lang, moment([moment('2021-02-15').format('YYYY'), moment('2021-02-15').format('M') - 1, moment('2021-02-15').format('D')]).toNow(true)))
            .addField(language.get('COMMAND_ABOUT_VERSION_TITLE', lang), language.get('COMMAND_ABOUT_VERSION_VALUE', lang))
            .addField(language.get('COMMAND_ABOUT_COMMANDS_TITLE', lang), language.get('COMMAND_ABOUT_COMMANDS_VALUE', lang))
            .addField(language.get('COMMAND_ABOUT_USERS_TITLE', lang), language.get('COMMAND_ABOUT_USERS_VALUE', lang, message.client.users.cache.size))
            .addField(language.get('COMMAND_ABOUT_GUILDS_TITLE', lang), language.get('COMMAND_ABOUT_GUILDS_VALUE', lang, message.client.guilds.cache.size))
            .addField(language.get('COMMAND_ABOUT_CREDITS_TITLE', lang), language.get('COMMAND_ABOUT_CREDITS_VALUE', lang))
            .addField(language.get('COMMAND_HELP_LINKS_TITLE', lang), language.get('COMMAND_HELP_LINKS_DESCRIPTION', lang))
            
        return message.channel.send(embed)
    }
}