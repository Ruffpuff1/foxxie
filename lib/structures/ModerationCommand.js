const mongo = require('./database/mongo')
const { userSchema } = require('../../lib/structures/database/UserSchema')
const Discord = require('discord.js')
const { modStatsAdd } =  require('../../src/tasks/stats')
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

        let guild = `servers.${guildId}.warnings`
        try {
            await userSchema.findByIdAndUpdate({
                _id: userId,
                "servers._id": '[guildId]'
            }, {
                _id: userId,
                $push: {
                     [guild]: warning }
            }, {
                upsert: true
            })

            let warn = await userSchema.findById({
                _id: userId
            })
            
            let settings = await msg.guild.settings.get(msg.guild)
            modStatsAdd(msg, 'warn', 1)

            if (warn.servers[0][0][guildId]["warnings"].length >= 3) {
                let staffcn = msg.guild.channels.cache.get('817006909492166656')
                if (staffcn) staffcn.send(`${tar.user.tag} (ID: ${tar.user.id}) now has **${warns.warnings.length}** warnings.`)
            }

            const dmEmbed = new Discord.MessageEmbed()
                .setTitle(`Warned in ${msg.guild.name}`)
                .setColor(msg.guild.me.displayColor)
                .setThumbnail(msg.guild.iconURL({dynamic:true}))
                .setDescription(`You have been warned in ${msg.guild.name} with the following reason:\n\`\`\`${res}\`\`\``)

            tar.send(dmEmbed)
            .catch(e => e)

            if (settings == null || settings.modChannel == null) return

            const embed = new Discord.MessageEmbed()
                .setTitle(`Warned ${tar.user.tag}`)
                .setColor(msg.guild.me.displayColor)
                .setTimestamp()
                .addField('**Warned User**', `<@${tar.user.id}> (ID: ${tar.user.id})`, true)
                .addField('**Moderator**', `<@${mod.user.id}> (ID: ${mod.user.id})`, true)
                .addField('\u200B', '\u200B', true)
                .addField('**Reason**', res, true)
                .addField('**Location**', msg.channel, true)
                .addField('**Date / Time**', warnDate, true)

            const channel = msg.guild.channels.cache.get(settings.modChannel);
            if (channel) channel.send(embed)

        } finally {}
    })
}