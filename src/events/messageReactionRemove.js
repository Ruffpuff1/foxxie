const { starCreated } = require("./starCreated");
const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'messageReactionRemove',
        })
    }

    async run(reaction, user) {

        if (reaction.message.channel.type === 'dm') return;
        if (reaction.emoji.name == '⭐') starCreated(reaction, user);
        this.client.monitors.get('rero').execute(reaction, user, 'remove');
    }
}