const moment = require('moment');
const { MessageEmbed, GuildMember } = require('discord.js');

class GuildLogger {

    constructor(guild) {
        this.guild = guild;
    };

    async send({ type, action, color, user, users, member, moderator, reason, duration, message, channel, oldMessage, newMessage, dm, counter, total, warn, warns, oldMember, newMember }) {

        if (counter) moderator.user.settings.inc(`servers.${this.guild.id}.modStats.${counter}`)
        if (action === 'purge' && total) moderator.user.settings.inc(`servers.${this.guild.id}.modStats.purgeTotal`, total);

        let date = moment(Date.now()).format('llll');
        if (dm) this.dm({ action, moderator, reason, duration, user, users, guild: this.guild, member });
        if (user && typeof user === 'string') user = await this.guild.client.users.fetch(user);
        if (user instanceof GuildMember) user = user.user;
        if (moderator && typeof moderator === 'string') moderator = await this.guild.client.users.fetch(moderator);
        const warnAuth = await this.guild.client.users.fetch(warn?.author).catch(() => null);

        const content = [
            user
                ? this.guild.language.get('LOG_ARGS_USER', user.tag, user.toString(), user.id)
                : null,
            users
                ? this.guild.language.get('LOG_ARGS_USERS', users.map((usr, idx) => `${idx + 1}. ${usr.tag} ${usr.toString()} (ID: ${usr.id})`).join('\n'))
                : null,
            channel
                ? `${this.guild.language.get('LOG_ARGS_CHANNEL', channel.toString(), channel.id)}${oldMessage && newMessage ? '' : '\n'}`
                : null,
            oldMessage && newMessage
                ? this.guild.language.get('LOG_ARGS_LINK', newMessage.url) + '\n'
                : null,
            member
                ? this.guild.language.get('LOG_ARGS_MEMBER', member.user.tag, member.user.toString(), member.id)
                : null,
            moderator
                ? this.guild.language.get('LOG_ARGS_MODERATOR', moderator.user.tag, moderator.user.toString(), moderator.user.id)
                : null,
            reason
                ? this.guild.language.get('LOG_ARGS_REASON', reason)
                : null,
            duration
                ? this.guild.language.get('LOG_ARGS_DURATION', duration)
                : null,
            message && message.cleanContent
                ? this.guild.language.get('LOG_ARGS_MESSAGE', message.cleanContent)
                : null,
            oldMessage && newMessage
                ? this.guild.language.get('LOG_ARGS_MESSAGES', oldMessage.cleanContent, newMessage.cleanContent)
                : null,
            message?.attachments?.size
                ? this.guild.language.get('LOG_ARGS_ATTACHMENTS', message.attachments.map(attachment => `[${this.guild.language.get('LOG_ARGS_IMAGES')}](${attachment.url})`))
                : null,
            oldMessage?.attachments?.size || newMessage?.attachments?.size
                ? this.guild.language.get('LOG_ARGS_ATTACHMENTS', newMessage.attachments.concat(oldMessage.attachments).map(attachment => `[${this.guild.language.get('LOG_ARGS_IMAGES')}](${attachment.url})`))
                : null,
            type === 'mod' || type === 'member'
                ? this.guild.language.get('LOG_ARGS_DATE', date)
                : null,
            warn && warnAuth
                ? '\n' + this.guild.language.get('LOG_ARGS_WARN', warn.reason, moment(warn.timestamp).format('llll'), warnAuth.tag, warnAuth.toString(), warnAuth.id)
                : null,
            warns
                ? '\n' + this.guild.language.get('LOG_ARGS_WARNS', warns.map((w, idx) => `${idx + 1}. ${w.reason}\non ${moment(w.timestamp).format('llll')}\nBy: ${tihs.guild.client.users.cache.get(w.author).tag} ${this.guild.client.users.cache.get(w.author).toString()} (ID: ${w.author})`).join('\n\n'))
                : null
        ].filter(item => item).join('\n');

        const embed = new MessageEmbed()
			.setTitle(this.guild.language.get(`LOG_ACTION_${action?.toUpperCase() || type?.toUpperCase()}`, total 
                ? total 
                : users 
                    ? users.length > 1
                        ? true
                        : false
                    : false)
            )
			.setDescription(content)
            .setTimestamp()
			.setColor(color || this.guild.me.displayColor);

        const channelId = await this.guild.settings.get(`log.${type}.channel`);
        if (!channelId) return;
        const chn = this.guild.channels.cache.get(channelId);
        if (!chn) return;

        chn.send(embed);
    }

    async dm({ user, users, action, moderator, reason, duration, guild, member }) {
        if (!user) user = member?.user;
        if (!users) users = [user];
        if (typeof moderator === 'string') moderator = await this.guild.client.users.fetch(moderator).catch(() => null);
        if (moderator instanceof GuildMember) moderator = moderator.user;
        
        for (let user of users) {
            if (typeof user === 'string') user = await this.guild.client.users.fetch(user).catch(() => null);
            if (!user) continue;

            const embed = new MessageEmbed()
                .setColor(this.guild.me.displayColor)
                .setTitle(guild.language.get(`LOG_DM_${action.toUpperCase()}`))
                .setThumbnail(guild.iconURL({dynamic: true}))
                .setDescription(`${guild.language.get(`LOG_DM_${action.toUpperCase()}`)} ${action.includes('ban') || action === 'kick'
                ? 'from' 
                : 'in'
            } **${guild.name}** ${duration 
                ? `for ${duration} `
                : ''
            }by **${moderator.tag}**: \`\`\`${reason}\`\`\``)

            user.send(embed).catch(() => null);
        }
    }
}

module.exports = GuildLogger;