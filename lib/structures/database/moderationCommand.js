const mongo = require('../database/mongo')
const warnSchema = require('../database/schemas/server/moderation/warnSchema')
const Discord = require('discord.js')
const { addWarn } =  require('../../../src/tasks/modCountAdd')
const { getGuildModChannel } = require('../../settings')
const moment = require('moment')
module.exports.moderationCommandWarn = async (msg, res, tar, mod) => {
    const warnDate = moment(msg.createdTimestamp).format('llll');

    const warning = {
        author: mod,
        timestamp: new Date().getTime(),
        reason: res
    }

    let guildId = msg.guild.id 
    let userId = tar.user.id

    await mongo().then(async () => {
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

            let results = await getGuildModChannel(msg)
            addWarn(mod)

            const warns = await warnSchema.findOne({
                guildId,
                userId
            })

            if (warns.warnings.length >= 3) {
                let staffcn = msg.guild.channels.cache.get('817006909492166656')
                if (staffcn) staffcn.send(`${tar.user.tag} (ID: ${tar.user.id}) now has **${warns.warnings.length}** warnings.`)
            }

            const dmEmbed = new Discord.MessageEmbed()
                .setTitle(`Warned in ${msg.guild.name}`)
                .setColor(msg.guild.me.displayColor)
                .setThumbnail(msg.guild.iconURL({dynamic:true}))
                .setDescription(`You have been warned in ${msg.guild.name} with the following reason:\n\`\`\`${res}\`\`\``)

            tar.send(dmEmbed)
            .catch(e => console.error(e))

            if (results === null) return

            const embed = new Discord.MessageEmbed()
                .setTitle(`Warned ${tar.user.tag}`)
                .setColor(msg.guild.me.displayColor)
                .setTimestamp()
                .addField('**Warned User**', `<@${tar.user.id}> (ID: ${tar.user.id})`, true)
                .addField('**Moderator**', `<@${mod.user.id}> (ID: ${mod.user.id})`, true)
                .addField('\u200B', '\u200B', true)
                .addField('**Reason**', res, true)
                .addField('**Location**', msg.channel.id, true)
                .addField('**Date / Time**', warnDate, true)

            const channel = msg.guild.channels.cache.get(results.channelId);
            if (channel) channel.send(embed)

        } finally {}
    })
}