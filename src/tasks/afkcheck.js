const Discord = require('discord.js')
const db = require('quick.db')
module.exports = client => {
    client.on('message', message => {

        if (message.author.bot) return
        if (message.channel.type === 'dm') return

        var lang;
        var language = db.get(`Guilds.${message.guild.id}.Settings.Language`)
        if (language
            ? language = language
            : language = 'en')
            lang = require(`../../src/languages/${language}`)

        if (db.has(`Guilds.${message.guild.id}.Users.${message.author.id}.Afk.Status`)) {
            let afkNickname = db.get(`Guilds.${message.guild.id}.Users.${message.author.id}.Afk.Nickname`)
            message.reply(lang.COMMAND_AFK_WELCOMEBACK)
            .then(msg => {setTimeout(() => msg.delete(), 10000)})

            message.member.setNickname(afkNickname).catch(error => console.error())
            .then(db.delete(`Guilds.${message.guild.id}.Users.${message.author.id}.Afk`))
        }

        message.mentions.users.forEach(
            user => {
                if (message.author.bot) return false

                if (message.content.includes('@here') || message.content.includes('@everyone')) return false

                if (db.has(`Guilds.${message.guild.id}.Users.${message.author.id}.Afk.Status`)) {
                let afkReasonShow = db.get(`Guilds.${message.guild.id}.Users.${message.author.id}.Afk.Reason`)

                const UserAfkEmbed = new Discord.MessageEmbed()
                    .setColor(message.guild.me.displayColor)
                    .setAuthor(`${user.tag} ${lang.COMMAND_AFK_ISSET}`, user.avatarURL( { dynamic: true } ))
                    .setDescription(`${lang.COMMAND_AFK_REASON} ${afkReasonShow}`)

                message.channel.send(UserAfkEmbed)
                .then( msg => { setTimeout(() => msg.delete(), 10000)})
                }
            }
        )
    })
}