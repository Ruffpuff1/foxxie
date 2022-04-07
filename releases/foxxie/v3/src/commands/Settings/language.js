// const Discord = require('discord.js')
// module.exports = {
//     name: 'language',
//     aliases: ['lang', 'setlang', 'setlanguage'],
//     category: 'settings',
//     usage: 'fox language [english/spanish/none]',
//     permissions: 'ADMINISTRATOR',
//     execute(lang, message, args, client) {
//         const embed = new Discord.MessageEmbed()
//             .setColor(message.guild.me.displayColor)
//         if (!args[0]) return message.channel.send(`${lang.COMMAND_LANGUAGE_NOARGS}`)
//         if (args[0].toLowerCase() === 'none') {
//             db.delete(`Guilds.${message.guild.id}.Settings.Language`)
//             embed.setDescription(lang.COMMAND_LANGUAGE_RESET)
//             message.channel.send(embed)
//             return
//         }
//         if (args[0].toLowerCase() === 'english' || args[0].toLowerCase() === 'en' || args[0].toLowerCase() === 'Inglés') {
//             db.set(`Guilds.${message.guild.id}.Settings.Language`, 'en')
//             embed.setDescription(lang.COMMAND_LANGUAGE_ENGLISH)
//             message.channel.send(embed)
//             return
//         }
//         if (args[0].toLowerCase() === 'spanish' || args[0].toLowerCase() === 'es' || args[0].toLowerCase() === 'Español') {
//             db.set(`Guilds.${message.guild.id}.Settings.Language`, 'es')
//             embed.setDescription(lang.COMMAND_LANGUAGE_SPANISH)
//             message.channel.send(embed)
//             return
//         }
//         embed.setDescription(lang.COMMAND_LANGUAGE_NOTVALIDLANG)
//         message.channel.send(embed)
//     }
// }