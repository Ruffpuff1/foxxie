const { ms, Command } = require('foxxie');

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

    run(msg, [time, ...rmdMessage]) {

        rmdMessage = rmdMessage.join(' ');

        if (!time) return msg.responder.error('COMMAND_REMINDME_INVALIDTIME');
        if (!/^\d*[s|m|h|d|w|y]$/gmi.test(time)) return msg.responder.error('COMMAND_REMINDME_INVALIDTIME');

        const timeago = ms(ms(time), { long: true } )
        if (!rmdMessage) return msg.responder.error('COMMAND_REMINDME_NOREASON');

        let sendIn = /\-channel\s*|-c\s*/gi
        rmdMessage = rmdMessage.replace(sendIn, '');

        const reminder = {
            guild: msg.guild.id,
            authID: msg.author.id,
            time: Date.now() + ms(time),
            rmdMessage,
            timeago,
            guildId: msg.guild.id,
            sendIn: sendIn.test(msg.content),
            color: msg.guild.me.displayColor,
            channelId: msg.channel.id,
        }

        this.client.schedule.create('reminders', reminder);
        msg.responder.success('COMMAND_REMINDME_SUCCESS', timeago);
    }
}