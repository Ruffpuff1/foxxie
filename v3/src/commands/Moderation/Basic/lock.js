const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'lock',
            aliases: ['l', 'lockdown'],
            description: language => language.get('COMMAND_LOCK_DESCRIPTION'),
            requiredPermissions: ['MANAGE_CHANNELS', 'ADD_REACTIONS'],
            usage: '(Channel) (...Reason)',
            permissions: 'MANAGE_CHANNELS',
            category: 'moderation',
        })

        this.permissions = 'MANAGE_CHANNELS';
    }

    async run(message, args) {

        const channel = message.channels.shift() || message.channel;
        if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) return message.responder.error('COMMAND_LOCK_ALREADY', channel.toString());
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
        msg.edit(message.language.get('COMMAND_LOCK_SUCCESS', channel.toString()));
        message.guild.log.send({ type: 'mod', action: 'lock', moderator: message.member, reason, channel, counter: 'lock' });
    }
}