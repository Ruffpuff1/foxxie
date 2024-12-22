const { MessageEmbed } = require('discord.js');
const { Task } = require('@foxxie/tails');

module.exports = class extends Task {

    async run({ channel, user, text, guild, sendIn, color, timeago }) {

        user = await this.client.users.fetch(user).catch(() => null);
        if (!user) return false;

        guild = this.client.guilds.cache.get(guild)
        if (!guild) return false;

        if (sendIn) return this.sendIn({ channel, user, text, guild, timeago });

        const embed = new MessageEmbed()
            .setAuthor(guild.language.get('TASK_REMINDER_AUTHOR', user.username), this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(guild.language.get('TASK_REMINDER', timeago, text))
            .setTimestamp()
            .setColor(color)

        return user.send(embed).catch(() => this.sendIn({ channel, user, text, guild, timeago }));
    }

    sendIn({ channel, user, text, guild, timeago }) {
        
        channel = guild.channels.cache.get(channel);
        if (!channel) return false;

        return channel.send(`${user.toString()} ${guild.language.get('TASK_REMINDER_SENDIN', timeago, text)}`).catch(() => null);
    }
}