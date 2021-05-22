const ms = require('ms');

module.exports = {
    name: 'disboardbump',
    type: 'message',
    async execute (message) {

        if (!message.author.id === '302050872383242240') return;

        let emb = message.embeds.length === 1
        ? (message.embeds[0]?.description?.endsWith(`https://disboard.org/`) ? true : false)
        : false

        if (!emb) return;
        return this._bumped(message);
    },

    async _bumped(message) {

        const bump = {
            guildId: message.guild.id,
            time: Date.now() + ms('2h')
        };

        message.client.schedule.create('disboard', bump);
    }
}