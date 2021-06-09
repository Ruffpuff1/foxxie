const { StarEvent } = require('../../lib/structures/StarEvent');
const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'starCreated'
        })
    }

    async run(reaction, user) {
        
        if (reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
            StarEvent(reaction, user)
        } else {
            StarEvent(reaction, user)
        }
    }
}