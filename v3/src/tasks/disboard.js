const { MessageEmbed } = require('discord.js');
const { Task } = require('@foxxie/tails');

module.exports = class extends Task {

    async run({ guild }) {

        const _guild = this.client.guilds.cache.get(guild);
        if (!_guild) return false;
        return this.message(_guild);
    }

    async message({ settings, channels, language, name, id, me }) {

        const channelId = await settings.get('disboard.channel');
        if (!channelId) return;
        const channel = channels.cache.get(channelId);
        if (!channel) return;

        let message = await settings.get('disboard.message') || language.get('TASK_DISBOARD_DEFAULT');
        const ping = await settings.get('disboard.ping');

        let role = ping ? `<@&${ping}>` : '';
        if (id === '761512748898844702') role = '**Heya <@&774339676487548969> it\'s time to bump the server.**';

        const embed = new MessageEmbed()
            .setColor(me.displayColor)
            .setTitle(language.get('TASK_DISBOARD'))
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(message.replace(/{(server|guild)}/gi, name));

        channel.send(role, embed);
    }
}