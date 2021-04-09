const mongo = require('../../../lib/structures/database/mongo')
const moment = require('moment')
const Discord = require('discord.js')
const warnSchema = require('../../../lib/structures/database/schemas/warnSchema')
const modchannelSchema = require('../../../lib/structures/database/schemas/modchannelSchema')
module.exports = {
    name: 'warn',
    aliases: ['w'],
    usage: 'fox warn [user] (reason)',
    permissions: 'MANAGE_MESSAGES',
    execute: async(lang, message, args) => {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.channel.send("You need to provide **one member** to give a warn to.")

        if (target.roles.highest.position > message.member.roles.highest.position) return message.channel.send("Higher roles")
        if (target.roles.highest.position > message.guild.me.roles.highest.position) return message.channel.send("Higher roles")

        const guildId = message.guild.id
        const userId = target.id
        let reason = args.slice(1).join(' ')

        const warnDate = moment(message.createdTimestamp).format('llll');

        if (!reason) reason = 'No reason specified'

        const warning = {
            author: message.member.user.id,
            timestamp: new Date().getTime(),
            reason
        }

        await mongo () .then(async (mongoose) => {
            try {
                await warnSchema.findOneAndUpdate({
                    guildId,
                    userId
                }, {
                    guildId,
                    userId,
                    $push: {
                        warnings: warning
                    }
                }, {
                    upsert: true
                })

                const results = await modchannelSchema.findById({
                    _id: message.guild.id
                })

                const warns = await warnSchema.findOne({
                    guildId,
                    userId
                })

                if (warns.warnings.length >= 3 && message.guild.id === '761512748898844702') {
                    let staffcn = message.guild.channels.cache.get("817006909492166656")
                    staffcn.send(`${target.user.tag} (ID: ${target.user.id}) now has **${warns.warnings.length}** warnings.`)
                } 

                const warnDmEmbed = new Discord.MessageEmbed()
                    .setTitle(`Warned in ${message.guild.name}`)
                    .setColor(message.guild.me.displayColor)
                    .setThumbnail(message.guild.iconURL({dynamic: true}))
                    .setDescription(`You have been warned in ${message.guild.name} with the following reason:\n\`\`\`${reason}\`\`\``)

                target.send(warnDmEmbed)
                    .catch(error => console.error(error))

                message.react('✅')

                if (results === null) return

                const warnEmbed = new Discord.MessageEmbed()
                    .setTitle(`Warned ${target.tag}`)
                    .setColor(message.guild.me.displayColor)
                    .setTimestamp()
                    .addFields(
                        { name: '**Warned User**', value: `${target} (ID: ${target.id})`, inline: true },
                        { name: '**Moderator**', value: `<@${message.author.id}> (ID: ${message.author.id})`, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: `**Reason**`, value: `${reason}`, inline: true },
                        { name: `**Location**`, value: `<#${message.channel.id}>`, inline: true },
                        { name: `**Date / Time**`, value: `${warnDate}`, inline: true })

                const logChannel = message.guild.channels.cache.get(results.channelId);
                if (logChannel) logChannel.send(warnEmbed)

            } finally {
                mongoose.connection.close()
            }
        })
    }
}