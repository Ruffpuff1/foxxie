const db = require('quick.db'); //depricated
module.exports = {
    name: 'clearnote',
    aliases: ['un', 'ncl'],
    usage: 'fox clearnote [member] [all]',
    category: 'moderation',
    permissions: 'ADMINISTRATOR',
    execute(lang, message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (member.roles.highest.position > message.member.roles.highest.position) return message.channel.send("Higher roles")
        if (member.roles.highest.position > message.guild.me.roles.highest.position) return message.channel.send("Higher roles")
        
        if (!member) return message.channel.send(`You need to provide a **member** to clear notes from.`)
        if (!args[1]) return message.channel.send(`You need to specify **all** to delete notes.`)

        if (args[1].toLowerCase() === 'all') {
            message.react('✅')
            return db.delete(`Guilds.${message.guild.id}.Users.${member.user.id}.Notes`)
        }
        message.channel.send(`You need to specify **all** to delete notes.`)
    }
}