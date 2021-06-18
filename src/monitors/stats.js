const { Monitor } = require('foxxie');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            monitor: 'stats',
            enabled: false,
            ignoreBots: false,
            ignoreSelf: false,
            ignoreEdits: true
        })
    }

    async run(msg) {
        if (!msg.guild) return;
        msg.author.settings.inc(`servers.${msg.guild.id}.messageCount`);
        msg.guild.settings.inc('messageCount');
    }
}