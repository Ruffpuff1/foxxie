const Discord = require('discord.js');
const moment = require('moment');
const { zws } = require('./util/constants');
const { MessageEmbed, GuildMember } = require('discord.js');

class GuildLogger {

    constructor(guild) {
        this.guild = guild;
    };

    async send({ type, action, color, user, users, member, moderator, reason, duration, message, channel, oldMessage, newMessage, dm, msg, counter, total }) {

        msg.author.settings.inc(`servers.${this.guild.id}.modStats.${counter}`)
        if (action === 'purge') 
        msg.author.settings.inc(`servers.${this.guild.id}.modStats.purgeTotal`, total);

        const lang = await this.guild.settings.get('language') || 'en-US';
        let date = moment(msg.createdTimestamp).format('llll');
        if (dm) this.dm({ action, moderator, reason, duration, user, users, guild: msg.guild, msg, member });
        if (user && typeof user === 'string') user = await this.guild.client.users.fetch(user);
        if (user instanceof GuildMember) user = user.user;
        if (moderator && typeof moderator === 'string') moderator = await this.guild.client.users.fetch(moderator);

        const content = [
            user
                ? this.guild.language.get('LOG_ARGS_USER', lang, user.tag, user.toString(), user.id)
                : null,
            users
                ? this.guild.language.get('LOG_ARGS_USERS', lang, users.map(usr => typeof usr === 'string' ? usr : usr.id).join(', '))
                : null,
            channel
                ? this.guild.language.get('LOG_ARGS_CHANNEL', lang, channel.toString(), channel.id) + '\n'
                : null,
            member
                ? this.guild.language.get('LOG_ARGS_MEMBER', lang, member.user.tag, member.user.toString(), member.id)
                : null,
            moderator
                ? this.guild.language.get('LOG_ARGS_MODERATOR', lang, moderator.user.tag, moderator.user.toString(), moderator.user.id)
                : null,
            reason
                ? this.guild.language.get('LOG_ARGS_REASON', lang, reason)
                : null,
            duration
                ? this.guild.language.get('LOG_ARGS_DURATION', lang, duration)
                : null,
            message && (message.cleanContent || message.attachments.size)
                ? this.guild.language.get('LOG_ARGS_MESSAGE', message.cleanContent, message.attachments.map(attachment => `<${attachment.url}>`))
                : null,
            oldMessage && newMessage
                ? this.guild.language.get('LOG_ARGS_MESSAGES', lang,
                    oldMessage.cleanContent, oldMessage.attachments.map(attachment => `<${attachment.url}>`),
                    newMessage.cleanContent, newMessage.attachments.map(attachment => `<${attachment.url}>`))
                : null,
            type === 'mod'
                ? this.guild.language.get('LOG_ARGS_DATE', lang, date)
                : null
        ].filter(item => item).join('\n');

        const embed = new MessageEmbed()
			.setTitle(this.guild.language.get(`LOG_ACTION_${action.toUpperCase()}`, lang))
			.setDescription(content)
            .setTimestamp()
			.setColor(color || this.guild.me.displayColor);

        const channelId = await this.guild.settings.get(`log.${type}.channel`);
        if (!channelId) return;
        const chn = this.guild.channels.cache.get(channelId);
        if (!chn) return;

        chn.send(embed);
    }

    async dm({ user, users, action, moderator, reason, duration, guild, msg, member }) {
        if (!user) user = member.user;
        if (!users) users = [user];
        if (typeof moderator === 'string') moderator = await this.guild.client.users.fetch(moderator).catch(() => null);
        if (moderator instanceof GuildMember) moderator = moderator.user;
        const lang = await this.guild.settings.get('language') || 'en-US';
        for (let user of users) {
            if (typeof user === 'string') user = await this.guild.client.users.fetch(user).catch(() => null);
            if (!user) continue;

            const embed = new MessageEmbed()
                .setColor(this.guild.me.displayColor)
                .setTitle(msg.language.get(`LOG_DM_${action.toUpperCase()}`, lang))
                .setThumbnail(this.guild.iconURL({dynamic: true}))
                .setDescription(`${msg.language.get(`LOG_DM_${action.toUpperCase()}`, lang)} ${action.includes('ban') || action === 'kick'
                ? 'from' 
                : 'in'
            } **${guild.name}** ${duration 
                ? `for ${duration} `
                : ''
            }by **${moderator.tag}**: \`\`\`${reason}\`\`\``)

            user.send(embed).catch(() => null);
        }
    }





















    async moderation (msg, target, reason, action, counter, lang, total) {

        let date = moment(msg.createdTimestamp).format('llll');
        const embed = new Discord.MessageEmbed()

        // Does the counters
        msg.author.settings.inc(`servers.${msg.guild.id}.modStats.${counter}`)
        if (counter?.toLowerCase() === 'purge') 
        msg.author.settings.inc(`servers.${msg.guild.id}.modStats.purgeTotal`, total);

        let channel = await msg.guild.settings.get('log.mod.channel');
        if (!channel) return;

        let chn = msg.guild.channels.cache.get(channel);
        if (!chn) return;
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