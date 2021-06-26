const { MessageEmbed } = require('discord.js');
const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'invite',
            aliases: ['botinvite', 'support', 'vote'],
            description: language => language.get('COMMAND_INVITE_DESCRIPTION'),
            category: 'utility'
        })
    }

    run(msg) {

        const flag = /\-channel\s*|-c\s*/gi;

        const embed = new MessageEmbed()
            .setColor(msg.guild.me.displayColor)
            .setAuthor(msg.language.get('COMMAND_INVITE_TITLE'), this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(msg.language.get('COMMAND_INVITE_LINKS', this.client.user.username, this.client.invite))

        flag.test(msg.content) ? msg.channel.send(embed) : msg.author.send(embed).catch(() => msg.channel.send(embed));
        msg.responder.success();
    }
}