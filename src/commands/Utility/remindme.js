const { ms } = require('foxxie');

module.exports = {
    name: 'remindme',
    aliases: ['rm'],
    usage: `remindme [1s|1m|1h|1d|1w] [reason] (-c|-channel)`,
    category: 'utility',
    execute(props) {

        let { message, args } = props;
        let remindTime = args[0]
        let remindMsg = args.slice(1).join(' ');

        if (!remindTime) return message.responder.error('COMMAND_REMINDME_NOTIME');
        if (!/^\d*[s|m|h|d|w|y]$/gmi.test(remindTime)) return message.responder.error('COMMAND_REMINDME_INVALIDTIME');
        
        let timeFromNow = ms(ms(remindTime), { long: true } )
        if (!remindMsg) return message.responder.error('COMMAND_REMINDME_NOREASON');

        let sendIn = /\-channel\s*|-c\s*/gi
        remindMsg = remindMsg.replace(sendIn, '')

        const reminder = {
            guild: message.guild.id,
            authID: message.author.id,
            time: Date.now() + ms(remindTime),
            rmdMessage: remindMsg,
            timeago: timeFromNow,
            guildId: message.guild.id,
            sendIn: sendIn.test(message.content),
            color: message.guild.me.displayColor,
            channelId: message.channel.id,
        }

        message.client.schedule.create('reminders', reminder);
        message.responder.success('COMMAND_REMINDME_SUCCESS', timeFromNow);
    }
}