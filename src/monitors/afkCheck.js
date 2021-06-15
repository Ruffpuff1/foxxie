const { MessageEmbed } = require('discord.js');
const { Monitor, ms } = require('foxxie');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            monitor: 'afkCheck'
        })
    }

    async run(msg) {

        if (!msg.guild) return;
        // checks for AFK user mentions
        msg.mentions.users.forEach(async user => {
            if (user.bot || msg.content.includes('@here') || msg.content.includes('@everyone') || !this.client.users.cache.get(user.id)) return false;
            const afk = await user.settings.get(`servers.${msg.guild.id}.afk`);
            if (!afk) return false;

            const embed = new MessageEmbed()
                .setColor(msg.guild.me.displayColor)
                .setAuthor(msg.language.get('MONITOR_AFK_AUTHOR', user.tag), user.avatarURL({ dynamic: true }))
                .setDescription(msg.language.get('MONITOR_AFK_DESCRIPTION', afk.reason, ms(Date.now() - afk.timeStamp, { long: true })))

            const message = await msg.channel.send(embed);
            message.delete({ timeout: 10000 });
        })

        // checks if message author is AFK
        const afk = await msg.author.settings.get(`servers.${msg.guild.id}.afk`);
        if (!afk || msg.content === afk.lastMessage) return false;

        // sends welcome back msg, and nick changes
        const message = await msg.reply(msg.language.get('MONITOR_AFKCHECK_WELCOMEBACK'));
        message.delete({ timeout: 10000});
        msg.member.setNickname(afk.nickname).catch(() => null);
        msg.author.settings.unset(`servers.${msg.guild.id}.afk`);
    }
}