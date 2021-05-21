const Discord = require('discord.js');
const Language = require('../../lib/Language');
const Reminder = require('../../lib/structures/Reminder');

module.exports = {
    name: 'reminder',
    async execute(client) {
    
        client.setInterval(async () => {

            const reminder = new Reminder(client);
            const reminders = await reminder.fetch('reminders');

            reminders.forEach(async rmdr => {

                const { time, authID, guildId, channelId } = rmdr;
                let member = client.users.cache.get(authID);
                const guild = client.guilds.cache.get(guildId);
                const channel = guild.channels.cache.get(channelId);
                const language = new Language(guild);

                if (Date.now() > time) {
                    this._remind(client, rmdr, { member, channel, language });
                    reminder.delete('reminders', rmdr);
                }
            });
        }, 1000);
    }, 

    _remind(client, { rmdMessage, timeago, sendIn, lang, color, authID }, { member, channel, language }) {

        const embed = new Discord.MessageEmbed()
                .setAuthor(language.get('TASK_REMINDER_FOR', lang, member.username), client.user.displayAvatarURL())
                .setColor(color)
                .setDescription(language.get('TASK_REMINDER', lang, timeago, rmdMessage))
                .setTimestamp();

        if (sendIn && channel) channel.send(`<@${authID}> ${language.get('TASK_REMINDER', lang, timeago, rmdMessage)}`);
        if (!sendIn) client.users.cache.get(authID)?.send(embed);
    }
};