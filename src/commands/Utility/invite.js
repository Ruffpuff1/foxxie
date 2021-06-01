const Discord = require('discord.js')
module.exports = {
    name: 'invite',
    aliases: ['botinvite'],
    //category: 'utility',
    usage: 'fox invite',
    execute(props) {

        let { lang, message } = props;

        const inviteEmbed = new Discord.MessageEmbed()
            .setAuthor(`${lang.COMMAND_INVITE_HERE}`, message.client.user.displayAvatarURL())
            .setColor(message.guild.me.displayColor)
            .setDescription(lang.COMMAND_INVITE_BODY)

            if (message.content.includes(`-c`)) {
                return message.channel.send(inviteEmbed)
            }
        message.author.send(inviteEmbed).catch(() => message.channel.send(inviteEmbed));
        message.responder.success();
    }
}