const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'lock',
            aliases: ['ul', 'release'],
            description: language => language.get('COMMAND_UNLOCK_DESCRIPTION'),
            usage: '(Channel) (...Reason)',
            permissions: 'MANAGE_CHANNELS',
            category: 'moderation',
        })
    }

    async run(message, args) {

        if (message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.responder.error('COMMAND_UNLOCK_ALREADY');

        const channel = message.channels.shift() || message.channel;
        let reason = args.slice(message.channels.length).join(' ') || message.language.get('LOG_MODERATION_NOREASON');
        let msg = await message.responder.success('COMMAND_UNLOCK_LOCKING');

        await channel.updateOverwrite(
            message.guild.id,
            { 
                SEND_MESSAGES : null
            },
            `${message.author.tag} | ${reason}`
        )

        message.responder.lock();
        msg.edit(message.language.get('COMMAND_UNLOCK_SUCCESS'));
        message.guild.log.send({ type: 'mod', action: 'unlock', moderator: message.member, reason, channel, counter: 'unlock' });
    }
}