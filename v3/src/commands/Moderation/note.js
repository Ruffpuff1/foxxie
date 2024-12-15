const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'note',
            aliases: ['n'],
            description: language => language.get('COMMAND_NOTE_DESCRIPTION'),
            requiredPermissions: ['ADD_REACTIONS'],
            usage: '[Member] [...Note]',
            category: 'moderation'
        })

        this.permissions = 'MANAGE_MESSAGES'
    }

    async run(msg, [_, ...note]) {
        const member = msg.members.shift();
        if (!member) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        note = note.join(' ') || msg.language.get('COMMAND_NOTE_NONOTE');

        await member.user.settings.push(`servers.${msg.guild.id}.notes`, { author: msg.member.id, reason: note });
        return msg.responder.success();
    }
}