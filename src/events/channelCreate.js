const { Event } = require('@foxxie/tails');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'channelCreate'
        })
    }

    async run(channel) {
        if (channel.partial || !channel.guild || !(channel.type === 'text')) return;
        const id = await channel.guild.settings.get('mod.roles.mute');
        channel.initMute(id);
    }
}