const { MessageEmbed } = require('discord.js');
const { Task } = require('foxxie');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, {
            name: 'reminder'
        })
    }

    run() {

        this.client.setInterval(async () => {
            const reminders = await this.client.schedule.fetch('reminders');
            reminders?.forEach(async reminder => {

                const { time, authID, guildId, channelId } = reminder;
                let member = this.client.users.cache.get(authID);
                const guild = this.client.guilds.cache.get(guildId);
                const channel = guild.channels.cache.get(channelId);
                const language = guild.language;

                if (Date.now() > time) {
                    if (member) this._remind(reminder, member, channel, language);
                    this.client.schedule.delete('reminders', reminder)
                }
            })
        }, 1000)
    }

    _remind({ rmdMessage, timeago, sendIn, color, authID }, user, channel, language) {

        const embed = new MessageEmbed()
            .setAuthor(language.get('TASK_REMINDER_AUTHOR', user.username), this.client.user.displayAvatarURL())
            .setColor(color)
            .setDescription(language.get('TASK_REMINDER', timeago, rmdMessage))
            .setTimestamp()

        // handles send in reminders
        if (sendIn && channel) channel.send(`<@${authID}> ${language.get('TASK_REMINDER_SENDIN', timeago, rmdMessage)}`);
        if (!sendIn && this.client.users.cache.get(authID)) user.send(embed).catch(() => {

            // handles when a user's dms are closed
            if (channel) channel.send(`<@${authID}> ${language.get('TASK_REMINDER_SENDIN', timeago, rmdMessage)}`);
            else return null;
        })
    }
}