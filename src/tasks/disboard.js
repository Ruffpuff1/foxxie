const { MessageEmbed } = require('discord.js');
const { Task } = require('foxxie');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, {
            name: 'disboard'
        })
    }

    async run() {

        this.client.setInterval(async () => {
            const disboard = await this.client.schedule.fetch('disboard');
            disboard?.forEach(async bump => {

                const { guildId, time } = bump;
                const guild = this.client.guilds.cache.get(guildId);
                if (!guild) return;

                if (Date.now() > time) {
                    this.message(guild);
                    return this.client.schedule.delete('disboard', bump);
                }
            })
        }, 1000)
    }

    async message({ settings, channels, language, name, id, me }) {

        const channelId = await settings.get('disboard.channel');
        if (!channelId) return;
        const channel = channels.cache.get(channelId);
        if (!channel) return;

        let message = await settings.get('disboard.message') || language.get('TASK_DISBOARD_DEFAULT');
        let role = '';
        const ping = await settings.get('disboard.ping');
        if (ping) role = `<@&${ping}>`;
        if (id === '761512748898844702') role = '**Heya <@&774339676487548969> it\'s time to bump the server.**';

        const embed = new MessageEmbed()
            .setColor(me.displayColor)
            .setTitle(language.get('TASK_DISBOARD'))
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(message.replace(/{(server|guild)}/gi, name));

        channel.send(role, embed);
    }
}