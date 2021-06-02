const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['botinvite', 'support', 'vote'],
    category: 'utility',
    usage: 'fox invite',
    execute({ message, language }) {

        const chnFlag = /\-channel\s*|-c\s*/gi;
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(language.get('COMMAND_INVITE_EMBED_TITLE'))
            .setDescription(language.get('COMMAND_INVITE_EMBED_DESCRIPTION'))

        chnFlag.test(message.content) ? message.channel.send(embed) : message.author.send(embed).catch(() => null);
        message.responder.success();
    }
}