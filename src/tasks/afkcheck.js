const Discord = require('discord.js')
const { getAfk, delAfk } = require('./afkChange')
const { getGuildLang } = require('../../lib/util/getGuildLang')
module.exports.afkCheck = async message => {

    if (message.author.bot) return
    if (message.channel.type === 'dm') return
    lang = getGuildLang(message)
    message.mentions.users.forEach(
        async user => {

            let userAfk = await getAfk(message, user)
            if (userAfk === null) return;
            if (message.author.bot) return;

            if (message.content.includes('@here') || message.content.includes('@everyone')) return false

            if (userAfk !== null) {

            const UserAfkEmbed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setAuthor(`${user.tag} ${lang.COMMAND_AFK_ISSET}`, user.avatarURL( { dynamic: true } ))
                .setDescription(`${lang.COMMAND_AFK_REASON} ${userAfk.afkReason}`)

            message.channel.send(UserAfkEmbed)
            .then( msg => { setTimeout(() => msg.delete(), 10000)})
            }
        }
    )
        let user = message.member.user
        let afk = await getAfk(message, user)
        if (afk === null) return;

        if (afk !== null) {
            if (afk.lastMsg === message.content) return;
            message.reply(lang.COMMAND_AFK_WELCOMEBACK)
            .then(msg => {setTimeout(() => msg.delete(), 10000)})

            message.member.setNickname(afk.afkNickname).catch(error => console.error())
            delAfk(message)
        }
}