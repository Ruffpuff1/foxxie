const Discord = require('discord.js');
const Language = require('../../lib/Language');

module.exports = {
    name: 'reminder',
    async execute(client) {
    
        client.setInterval(async () => {

            const reminders = await client.schedule.fetch('reminders');

            reminders?.forEach(async rmdr => {

                const { time, authID, guildId, channelId } = rmdr;
                let member = client.users.cache.get(authID);
                const guild = client.guilds.cache.get(guildId);
                const channel = guild.channels.cache.get(channelId);
                const language = new Language(guild);

                if (Date.now() > time) {
                    this._remind(client, rmdr, { member, channel, language });
                    client.schedule.delete('reminders', rmdr);
                }
            });
        }, 1000);
    }, 

    _remind(client, { rmdMessage, timeago, sendIn, lang, color, authID }, { member, channel, language }) {

        const user = client.users.cache.get(authID);
        if (!channel) return;
        if (!user) return;

        const embed = new Discord.MessageEmbed()
                .setAuthor(language.get('TASK_REMINDER_FOR', lang, member.username), client.user.displayAvatarURL())
                .setColor(color)
                .setDescription(language.get('TASK_REMINDER', lang, timeago, rmdMessage))
                .setTimestamp();

        if (sendIn && channel) channel.send(`<@${authID}> ${language.get('TASK_REMINDER', lang, timeago, rmdMessage)}`);
        if (!sendIn) user.send(embed);
    }
};