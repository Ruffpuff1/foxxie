const Discord = require('discord.js')

module.exports = {
    name: 'disboard',
    async execute(client) {

        client.setInterval(async () => {

            const disboard = await client.schedule.fetch('disboard');

            disboard?.forEach(async dsb => {

                const { guildId, time } = dsb;
                let guild = client.guilds.cache.get(guildId);
                if (!guild) return;

                if (Date.now() > time) {

                    await this.message(client, guild);
                    return client.schedule.delete('disboard', dsb);
                }
            })
        }, 1000)
    },

    async message(client, guild) {

        let channelId = await guild.settings.get('disboard.channel');
        if (!channelId) return;
        let channel = guild.channels.cache.get(channelId);
        if (!channel) return;

        let lang = await guild.settings.get('language');
        if (!lang) lang = 'en-US';

        let message = await guild.settings.get('disboard.message');
        if (!message) message = guild.language.get('TASK_DISBOARD_DEFAULT_DISBOARDMESSAGE', lang);

        let role = '';
        let ping = await guild.settings.get('disboard.ping');
        if (ping) role = `<@&${ping}>`;
        if (guild.id === '761512748898844702') role = '**Heya <@&774339676487548969> it\'s time to bump the server.**';

        const embed = new Discord.MessageEmbed()
            .setColor(guild.me.displayColor)
            .setTitle(guild.language.get('TASK_DISBOARD_EMBED_TITLE', lang))
            .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            .setDescription(message.replace(/{(server|guild)}/gi, guild.name));

        await channel.send(role, embed);
    }
}