const mongo = require('./database/mongo')
const { userSchema } = require('../../lib/structures/database/UserSchema')
const Discord = require('discord.js')
module.exports.moderationCommandWarn = async (msg, res, tar, mod, lang) => {
    
    const warning = { author: mod, timestamp: new Date().getTime(), reason: res }

    await mongo().then(async () => {

        let guild = `servers.${msg.guild.id}.warnings`
        try {
            await userSchema.findByIdAndUpdate({
                _id: tar.user.id
            }, {
                _id: tar.user.id,
                $push: {
                     [guild]: warning }
            }, {
                upsert: true
            })

            let warn = await userSchema.findById({
                _id: tar.user.id
            })
            
            if (warn.servers[0][msg.guild.id]["warnings"].length >= 3) {
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

            msg.guild.logger.moderation(msg, tar.user, res, 'Warned', 'warn', lang)

        } finally {}
    })
}