const { ms, Monitor } = require('@foxxie/tails');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreBots: false,
            ignoreOthers: false,
            ignoreOwner: true
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