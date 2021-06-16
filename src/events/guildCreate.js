const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'guildCreate'
        })
    }

    run(guild) {
        guild.createMuteRole();
    }
}