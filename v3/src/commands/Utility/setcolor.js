const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'setcolor',
            aliases: ['sc', 'setcolour'],
            description: language => language.get('COMMAND_SETCOLOR_DESCRIPTION'),
            requiredPermissions: ['ADD_REACTIONS', 'MANAGE_ROLES'],
            usage: '[Role] [Color]',
            category: 'utility'
        })

        this.permissions = 'MANAGE_ROLES';
    }

    run(msg, args) {

        const role = msg.roles.shift();
        if (!role) return msg.responder.error('COMMAND_SETCOLOR_NOROLE');
        const color = args[1];

        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return msg.responder.error('COMMAND_SETCOLOR_INVALIDCOLOR');
        role.setColor(color).catch(() => msg.responder.error('COMMAND_SETCOLOR_NOPERMS'));

        msg.responder.success();
    }
}