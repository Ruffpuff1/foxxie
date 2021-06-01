const Discord = require('discord.js')
module.exports = {
    name: 'support',
    usage: 'fox support',
    category: 'utility',
    execute(props) {

        let { message, language } = props;

        const inviteEmbed = new Discord.MessageEmbed()
            .setAuthor(language.get('COMMAND_SUPPORT_HERE'), message.client.user.displayAvatarURL())
            .setColor(message.guild.me.displayColor)
            .setDescription(language.get('COMMAND_SUPPORT_BODY'))

        if (/(-c|-channel)/i.test(message.content)) return message.channel.send(inviteEmbed);
        message.author.send(inviteEmbed).catch(() => { message.channel.send(inviteEmbed) });
        message.responder.success();
    }
}