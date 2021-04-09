const Discord = require('discord.js')
const db = require('quick.db')
module.exports = {
    name: 'afk',
    aliases: ['away', 'idle'],
    description: 'Sets an AFK for when people ping ya. You can provide a reason, but if no reason is provided it will show as \'none\'. When pinged in chat your AFK status will show. And the next time you talk in chat your AFK will be removed.',
    usage: `fox afk (reason)`,
    guildOnly: true,
    execute(lang, message, args) {
        let reason = args.slice(0).join(' ') || 'AFK';

        db.set(`Guilds.${message.guild.id}.Users.${message.author.id}.Afk.Nickname`, message.member.displayName)
        db.set(`Guilds.${message.guild.id}.Users.${message.author.id}.Afk.Status`, true)
        db.set(`Guilds.${message.guild.id}.Users.${message.author.id}.Afk.Reason`, reason)

        const AFKEmbed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(`${message.author.tag} ${lang.COMMAND_AFK_HAS_SET}`, message.member.user.avatarURL( { dynamic: true } ))
            .setDescription(`${lang.COMMAND_AFK_REASON} ${reason}`)

        message.member.setNickname(`[AFK] ${message.member.displayName}`)
        .catch(console.error).then(
            
        message.react('✅'),
        message.channel.send(AFKEmbed)
        .then(msg => {setTimeout(() => msg.delete(), 10000) 
        }))
    }
}