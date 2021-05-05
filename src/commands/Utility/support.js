const Discord = require('discord.js')
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'support',
    usage: 'fox support',
    category: 'utility',
    execute(props) {

        let { lang, message, args } = props;
        const inviteEmbed = new Discord.MessageEmbed()
            .setAuthor(lang.COMMAND_SUPPORT_HERE, message.client.user.displayAvatarURL())
            .setColor(message.guild.me.displayColor)
            .setDescription(lang.COMMAND_SUPPORT_BODY)

            if (message.content.includes(`-c`)) {
                return message.channel.send(inviteEmbed)
            }
        message.author.send(inviteEmbed).catch(error => {message.channel.send(inviteEmbed);
        });
    
        message.react(approved)
    }
}