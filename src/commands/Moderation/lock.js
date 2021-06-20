const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'lock',
            aliases: ['l', 'lockdown'],
            description: language => language.get('COMMAND_LOCK_DESCRIPTION'),
            usage: '(Channel) (...Reason)',
            permissions: 'MANAGE_CHANNELS',
            category: 'moderation',
        })
    }

    async run(message, args) {

        if (!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.responder.error('COMMAND_LOCK_ALREADY');

        const channel = message.channels.shift() || message.channel;
        let reason = args.slice(message.channels.length).join(' ') || message.language.get('LOG_MODERATION_NOREASON');
        let msg = await message.responder.success('COMMAND_LOCK_LOCKING');

        await channel.updateOverwrite(
            message.guild.id,
            { 
                SEND_MESSAGES : false 
            },
            `${message.author.tag} | ${reason}`
        )
        
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(700);

        message.responder.lock();
        msg.edit(message.language.get('COMMAND_LOCK_SUCCESS'));
        message.guild.log.send({ type: 'mod', action: 'lock', moderator: message.member, reason, channel, counter: 'lock' });
    }
}