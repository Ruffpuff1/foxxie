const { Event } = require('@foxxie/tails');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'commandUnknown'
        })
    }

    async run(msg, command) {
        if (!msg.guild) return null;
        const tags = await msg.guild.settings.get('tags');
        const tag = tags?.find(({name}) => name === command?.toLowerCase());
        if (!tag) return null;
        
        msg.channel.send(tag.text);
    }
}