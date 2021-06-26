const { Monitor } = require('@foxxie/tails');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            enabled: false,
            ignoreBots: false,
            ignoreSelf: false,
            ignoreOthers: false,
            ignoreEdits: true
        })
    }

    async run(msg) {
        if (!msg.guild) return;
        msg.author.settings.inc(`servers.${msg.guild.id}.messageCount`);
        msg.guild.settings.inc('messageCount');
    }
}