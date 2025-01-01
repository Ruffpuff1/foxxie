const { ms, Command } = require('@foxxie/tails');
const { Duration } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'remindme',
            aliases: ['rm'],
            description: language => language.get('COMMAND_REMINDME_DESCRIPTION'),
            usage: `remindme [Time] [...Reason] (-c)`,
            category: 'utility',
        })
    }

    run(msg, [time, ...text]) {

        text = text.join(' ');

        if (!time) return msg.responder.error('COMMAND_REMINDME_INVALIDTIME');
        if (!/^\d*[s|m|h|d|w|y]$/gmi.test(time)) return msg.responder.error('COMMAND_REMINDME_INVALIDTIME');

        const timeago = ms(ms(time), { long: true } )
        if (!text) return msg.responder.error('COMMAND_REMINDME_NOREASON');
        time = new Duration(time).fromNow;

        let sendIn = /\-channel\s*|-c\s*/gi
        text = text.replace(sendIn, '');

        this.client.schedule.create('reminder', time, {
            data: {
                guild: msg.guild.id,
                channel: msg.channel.id,
                user: msg.author.id,
                sendIn: sendIn.test(msg.content),
                color: msg.guild.me.displayColor,
                timeago,
                text
            }
        })

        return msg.responder.success('COMMAND_REMINDME_SUCCESS', timeago);
    }
}