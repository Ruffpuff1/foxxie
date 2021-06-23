const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'note',
            aliases: ['n'],
            description: language => language.get('COMMAND_NOTE_DESCRIPTION'),
            usage: '[Member] [...Note]',
            permissions: 'MANAGE_MESSAGES',
            category: 'moderation'
        })
    }

    async run(msg, [_, ...note]) {
        const member = msg.members.shift();
        if (!member) return msg.responder.error('MESSAGE_MEMBERS_NONE');
        note = note.join(' ') || msg.language.get('COMMAND_NOTE_NONOTE');

        await member.user.settings.push(`servers.${msg.guild.id}.notes`, { author: msg.member.id, reason: note });
        return msg.responder.success();
    }
}