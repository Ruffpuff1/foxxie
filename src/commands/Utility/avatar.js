const Discord = require('discord.js')
module.exports = {
    name: 'avatar',
    aliases: ['av', 'icon', 'pfp', 'usericon'],
    description: 'Get a high resolution image of a user\'s profile picture. In PNG, JPEG, and WEBP formats.',
    usage: 'avatar (user)',
    guildOnly: false,
    execute(lang, message, args, client) {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.member.user;
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