const Discord = require('discord.js')
const { setAfkNickname, setAfkReason, setAfkStatus, setAfkLastMsg } = require('../../../src/tasks/afkChange')
module.exports = {
    name: 'afk',
    aliases: ['away', 'idle'],
    usage: `fox afk (reason)`,
    category: 'utility',
    execute: async(props) => {

        let { lang, message, args } = props;

        let reason = args.slice(0).join(' ') || 'AFK';
        let boolean = true

        setAfkNickname(message, message.member.displayName)
        setAfkReason(message, reason)
        setAfkStatus(message, boolean)
        setAfkLastMsg(message)

        const AFKEmbed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(`${message.author.tag} ${lang.COMMAND_AFK_HAS_SET}`, message.member.user.avatarURL( { dynamic: true } ))
            .setDescription(`${lang.COMMAND_AFK_REASON} ${reason}`)

        message.member.setNickname(`[AFK] ${message.member.displayName}`)
        .catch(console.error).then(
            
        message.responder.success(),
        message.channel.send(AFKEmbed)
        .then(msg => {setTimeout(() => msg.delete(), 10000) 
        }))
    }
}