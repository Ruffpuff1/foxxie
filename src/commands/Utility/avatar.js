const Discord = require('discord.js')
module.exports = {
    name: 'avatar',
    aliases: ['av', 'icon', 'pfp', 'usericon'],
    usage: 'avatar (user|userId)',
    category: 'utility',
    execute(props) {

        let { lang, message, args, language} = props;
        let user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0]?.toLowerCase())?.user || message.guild.members.cache.find(m => m.displayName === args[0]?.toLowerCase())?.user || message.member.user;
        
        const description = [
            `(**ID**: ${user.id})`,
            `[PNG](${user.displayAvatarURL({ format: "png", dynamic: true, size: 512})}) | [JPEG](${user.displayAvatarURL({ format: "jpeg", dynamic: true, size: 512})}) | [WEBP](${user.displayAvatarURL({ format: "webp", dynamic: true, size: 512})})`
        ];
        if (user.id === message.client.user.id) description.push("\n" + language.get('COMMAND_AVATAR_FOXXIE', lang))

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(user.tag)
            .setDescription(description.join("\n"))
            .setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 512}))

        message.reply(embed)
    }
}