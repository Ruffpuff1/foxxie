const { ms, Monitor } = require('foxxie');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            monitor: 'disboardBump',
            ignoreBots: false,
            ignoreEdits: true,
            ignoreOwner: true,
            ignoreBlacklistedUsers: true
        })
    }

    run(msg) {
        if (!msg.author.id === '302050872383242240') return;
        const embed = msg.embeds.length === 1 
            ? (msg.embeds[0]?.description?.endsWith(`https://disboard.org/`) ? true : false)
            : false;

        if (!embed) return;
        return this.client.schedule.create('disboard', { guildId: msg.guild.id, time: Date.now() + ms('2h') })
    } 
}