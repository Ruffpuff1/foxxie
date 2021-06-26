const { MessageEmbed } = require('discord.js');
const { Command } = require('@foxxie/tails');
const { Duration, Timestamp } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'about',
            aliases: ['botinfo'],
            description: language => language.get('COMMAND_ABOUT_DESCRIPTION'),
            category: 'utility',
        })
    }

    run(msg) {

        const timestamp = new Timestamp('MMMM d YYYY');

        const embed = new MessageEmbed()
            .setTitle(msg.language.get('COMMAND_ABOUT_TITLE', this.client.user.username))
            .setColor(msg.guild.me.displayColor)
            .setDescription(msg.language.get('COMMAND_ABOUT_SUMMARY'))
            .setThumbnail(this.client.user.displayAvatarURL())
            .addField(msg.language.get('COMMAND_ABOUT_CREATED_TITLE'), msg.language.get('COMMAND_ABOUT_CREATED_VALUE', timestamp.display(this.client.user.createdAt), Duration.toNow(this.client.user.createdAt)))
            .addField(msg.language.get('COMMAND_ABOUT_VERSION_TITLE'), msg.language.get('COMMAND_ABOUT_VERSION_VALUE'))
            .addField(msg.language.get('COMMAND_ABOUT_COMMANDS_TITLE'), msg.language.get('COMMAND_ABOUT_COMMANDS_VALUE', this.client.commands.size.toLocaleString(), this.client.commands.aliases.size.toLocaleString()))
            .addField(msg.language.get('COMMAND_ABOUT_USERS_TITLE'), msg.language.get('COMMAND_ABOUT_USERS_VALUE', this.client.users.cache.size.toLocaleString()))
            .addField(msg.language.get('COMMAND_ABOUT_GUILDS_TITLE'), msg.language.get('COMMAND_ABOUT_GUILDS_VALUE', this.client.guilds.cache.size.toLocaleString()))
            .addField(msg.language.get('COMMAND_ABOUT_CREDITS_TITLE'), msg.language.get('COMMAND_ABOUT_CREDITS_VALUE'))
            
        return msg.channel.send(embed)
    }
}