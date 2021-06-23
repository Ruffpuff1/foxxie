const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'unlock',
            aliases: ['ul', 'release'],
            description: language => language.get('COMMAND_UNLOCK_DESCRIPTION'),
            usage: '(Channel) (...Reason)',
            permissions: 'MANAGE_CHANNELS',
            category: 'moderation',
        })
    }

    async run(message, args) {

        const channel = message.channels.shift() || message.channel;
        if (channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.responder.error('COMMAND_UNLOCK_ALREADY', channel.toString());
        let reason = args.slice(message.channels.length).join(' ') || message.language.get('LOG_MODERATION_NOREASON');
        let msg = await message.responder.success('COMMAND_UNLOCK_UNLOCKING');

        await channel.updateOverwrite(
            message.guild.id,
            { 
                SEND_MESSAGES : null
            },
            `${message.author.tag} | ${reason}`
        )

        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(700);

        message.responder.unlock();
        msg.edit(message.language.get('COMMAND_UNLOCK_SUCCESS', channel.toString()));
        message.guild.log.send({ type: 'mod', action: 'unlock', moderator: message.member, reason, channel, counter: 'unlock' });
    }
}