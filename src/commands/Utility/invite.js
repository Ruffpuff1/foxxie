const Discord = require('discord.js')
module.exports = {
    name: 'invite',
    aliases: ['botinvite'],
    description: 'Gives ya my invite link so you can have me help out your server.',
    usage: 'fox invite',
    execute(lang, message, args, client) {
        const inviteEmbed = new Discord.MessageEmbed()
            .setAuthor(`${lang.COMMAND_INVITE_HERE}`, client.user.displayAvatarURL())
            .setColor(message.guild.me.displayColor)
            .setDescription(lang.COMMAND_INVITE_BODY)

            if (message.content.includes(`-c`)) {
                return message.channel.send(inviteEmbed)
            }
        message.author.send(inviteEmbed).catch(error => {message.channel.send(inviteEmbed);
        });
    
        message.react('✅')
    }
}