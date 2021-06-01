const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
    name: 'about',
    aliases: ['botinfo'],
    usage: 'fox about',
    category: 'utility',
    execute(props) {

        let { message, language } = props;

        const embed = new Discord.MessageEmbed()
            .setTitle(language.get('COMMAND_ABOUT_TITLE'))
            .setColor(message.guild.me.displayColor)
            .setDescription(language.get('COMMAND_ABOUT_SUMMARY'))
            .setThumbnail(message.client.user.displayAvatarURL())
            .addField(language.get('COMMAND_ABOUT_CREATED_TITLE'), language.get('COMMAND_ABOUT_CREATED_VALUE', moment([moment('2021-02-15').format('YYYY'), moment('2021-02-15').format('M') - 1, moment('2021-02-15').format('D')]).toNow(true)))
            .addField(language.get('COMMAND_ABOUT_VERSION_TITLE'), language.get('COMMAND_ABOUT_VERSION_VALUE'))
            .addField(language.get('COMMAND_ABOUT_COMMANDS_TITLE'), language.get('COMMAND_ABOUT_COMMANDS_VALUE'))
            .addField(language.get('COMMAND_ABOUT_USERS_TITLE'), language.get('COMMAND_ABOUT_USERS_VALUE', message.client.users.cache.size))
            .addField(language.get('COMMAND_ABOUT_GUILDS_TITLE'), language.get('COMMAND_ABOUT_GUILDS_VALUE', message.client.guilds.cache.size))
            .addField(language.get('COMMAND_ABOUT_CREDITS_TITLE'), language.get('COMMAND_ABOUT_CREDITS_VALUE'))
            .addField(language.get('COMMAND_HELP_LINKS_TITLE'), language.get('COMMAND_HELP_LINKS_DESCRIPTION'))
            
        return message.channel.send(embed)
    }
}