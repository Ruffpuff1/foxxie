const { ms } = require('foxxie');

module.exports = {
    name: 'slowmode',
    aliases: ['slowchat', 'slow', 'freeze', 's', 'sm'],
    usage: 'fox slowmode [seconds|none] (reason)',
    category: 'moderation',
    permissions: 'MANAGE_CHANNELS',
    async execute({ message, args, language }) {
        
        if (!args[0]) return message.responder.error('COMMAND_SLOWMODE_NOARGS');
        let reason = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON');
        if (/(none|no|off)/i.test(args[0])) args[0] = 0;

        let time = Math.floor(args[0])
        if (isNaN(time)) return message.responder.error('COMMAND_SLOWMODE_NOTANUMBER');
        if (time > 21600 || time < 0) return message.responder.error('COMMAND_SLOWMODE_INVALIDTIME');

        await message.channel.setRateLimitPerUser(time)
        message.responder.success();
        return message.guild.log.send({ type: 'mod', action: 'slowmode', reason, moderator: message.member, channel: message.channel, counter: 'slowmode', duration: time === 0 ? null : ms(time * 1000, { long: true }) });
    }
}