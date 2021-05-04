// const mongo = require('../../../lib/structures/database/mongo')
// const { serverSettings } = require('../../../lib/settings')
// const moment = require('moment')
// const { emojis: { approved } } = require('../../../lib/util/constants')
// const Discord = require('discord.js')
// const warnSchema = require('../../../lib/structures/database/schemas/server/moderation/warnSchema')
// module.exports = {
//     name: 'clearwarn',
//     aliases: ['clearwarns', 'cw', 'unwarn', 'uw', 'pardon', 'warnremove'],
//     usage: 'fox unwarn [user|userId] (reason)',
//     category: 'moderation',
//     permissions: 'ADMINISTRATOR',
//     execute: async(lang, message, args) => {
//         const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
//         if (!target) return message.channel.send("You need to provide **one member** to unwarn");

//         if (target.roles.highest.position > message.member.roles.highest.position) return message.channel.send("Higher roles")
//         if (target.roles.highest.position > message.guild.me.roles.highest.position) return message.channel.send("Higher roles")

//         const guildId = message.guild.id
//         const userId = target.user.id
//         let reason = args.slice(1).join(' ')

//         const warnDate = moment(message.createdTimestamp).format('llll');

//         if (!reason) reason = 'No reason specified'

//         await mongo().then(async (mongoose) => {
//             try {

//                 await warnSchema.findOneAndDelete({
//                     guildId,
//                     userId,
//                 })
//                 message.react(approved)
                
//                 let results = await serverSettings(message)

//                 const warnDmEmbed = new Discord.MessageEmbed()
//                     .setTitle(`Warnings cleared in ${message.guild.name}`)
//                     .setColor(message.guild.me.displayColor)
//                     .setThumbnail(message.guild.iconURL({dynamic: true}))
//                     .setDescription(`Your warnings have been cleared in ${message.guild.name} with the following reason:\n\`\`\`${reason}\`\`\``)

//                 target.send(warnDmEmbed)
//                     .catch(error => console.error(error))
                
//                 message.react(approved)
                
//                 if (results == null || results.modChannel == null) return

//                 const warnEmbed = new Discord.MessageEmbed()
//                     .setTitle(`Cleared warnings for ${target.user.tag}`)
//                     .setColor(message.guild.me.displayColor)
//                     .setTimestamp()
//                     .addFields(
//                         { name: '**Cleared User**', value: `${target} (ID: ${target.user.id})`, inline: true },
//                         { name: '**Moderator**', value: `<@${message.author.id}> (ID: ${message.author.id})`, inline: true },
//                         { name: '\u200B', value: '\u200B', inline: true },
//                         { name: `**Reason**`, value: `${reason}`, inline: true },
//                         { name: `**Location**`, value: `<#${message.channel.id}>`, inline: true },
//                         { name: `**Date / Time**`, value: `${warnDate}`, inline: true })

//                 const logChannel = message.guild.channels.cache.get(results.modChannel);
//                 if (logChannel) logChannel.send(warnEmbed)

//             } finally {}
//         })
//     }
// }