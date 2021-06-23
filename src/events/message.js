const { Event } = require('foxxie');
const { Permissions: { FLAGS } } = require('discord.js')

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'message',
        })
    }

    async run(message) {

        message.channel.postable = !this.guild || this.permissionsFor(this.guild.me).has([FLAGS.VIEW_CHANNEL, FLAGS.SEND_MESSAGES], false);
        this.client.monitors.run(message);
    }
}