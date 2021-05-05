const Discord = require('discord.js')
module.exports = {
    name: 'avatar',
    aliases: ['av', 'icon', 'pfp', 'usericon'],
    usage: 'avatar (user|userId)',
    category: 'utility',
    execute(props) {

        let { lang, message, args } = props;
        let user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.member.user;
        let isBot = user.id === '812546582531801118'

        const urlPNG = user.displayAvatarURL({ format: "png", dynamic: true, size: 512});
        const urlJPEG = user.displayAvatarURL({ format: "jpeg", dynamic: true, size: 512});
        const urlWEBP = user.displayAvatarURL({ format: "webp", dynamic: true, size: 512});

        const avatarEmbed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(user.tag)
            .setDescription(`(**ID:** ${user.id})\n[PNG](${urlPNG}) | [JPEG](${urlJPEG}) | [WEBP](${urlWEBP})`)
            .setImage(urlPNG)

        if (isBot) avatarEmbed.setDescription(`(**ID:** ${user.id})\n[PNG](${urlPNG}) | [JPEG](${urlJPEG}) | [WEBP](${urlWEBP})\n\n${lang.COMMAND_AVATAR_FOXXIEAV}`)
        message.reply(avatarEmbed)
    }
}