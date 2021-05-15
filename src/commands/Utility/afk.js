const Discord = require('discord.js');
module.exports = {
    name: 'afk',
    aliases: ['away', 'idle'],
    usage: `fox afk (reason)`,
    category: 'utility',
    execute: async(props) => {

        let { lang, message, args, language } = props;

        let reason = args.slice(0).join(' ') || 'AFK';
        message.author.settings.set(`servers.${message.guild.id}.afk`, { nickname: message.member.displayName, reason, status: true, lastMessage: message.content })

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(language.get('COMMAND_AFK_EMBED_AUTHOR', lang, message.author.tag), message.member.user.avatarURL( { dynamic: true } ))
            .setDescription(language.get('COMMAND_AFK_EMBED_DESCRIPTION', lang, reason))

        message.member.setNickname(`[AFK] ${message.member.displayName}`).catch(e => console.error(e.message))
        
        message.responder.success(),
        message.channel.send(embed)
        .then(msg => {setTimeout(() => msg.delete(), 10000)})
    }
}