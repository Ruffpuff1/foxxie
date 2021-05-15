const Discord = require('discord.js')
const moment = require('moment')
const { zws } = require('./util/constants')

class GuildLogger {

    constructor(guild) {
        this.guild = guild;
    };

    async moderation (msg, target, reason, action, counter, lang, total) {

        let date = moment(msg.createdTimestamp).format('llll');
        const embed = new Discord.MessageEmbed()
        let channel = await msg.guild.settings.get('modChannel');
        if (!channel) return;

        let chn = msg.guild.channels.cache.get(channel);
        if (!chn) return;
        // Does the counters
        msg.author.settings.inc(`servers.${msg.guild.id}.modStats.${counter}`)
        if (counter?.toLowerCase() === 'purge') 
        msg.author.settings.inc(`servers.${msg.guild.id}.modStats.purgeTotal`, total);
        // Sends and loads the embed.
        await content()
        return chn.send(embed)

        async function content(){
            return embed
                    .setTitle(msg.language.get(`LOG_MODERATION_${action.toUpperCase()}`, lang, target.tag))
                    .setColor(msg.guild.me.displayColor)
                    .setTimestamp()
                    .addField(msg.language.get(`LOG_MODERATION_EMBED_TITLE`, lang, action), `${target} (ID: ${target.id})`, true)
                    .addField(msg.language.get(`LOG_MODERATION_EMBED_MODERATOR`, lang), `<@${msg.member.user.id}> (ID: ${msg.member.user.id})`, true)
                    .addField(zws, zws, true)
                    .addField(msg.language.get(`LOG_MODERATION_EMBED_REASON`, lang), reason, true)
                    .addField(msg.language.get(`LOG_MODERATION_EMBED_LOCATION`, lang), msg.channel, true)
                    .addField(msg.language.get(`LOG_MODERATION_EMBED_DATE`, lang), date, true)
        }
    }
}

module.exports = GuildLogger;