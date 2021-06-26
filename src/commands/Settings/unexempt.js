const { Command } = require('@foxxie/tails');
const { User, Role } = require('discord.js')

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'unexempt',
            aliases: ['unignore'],
            description: language => language.get('COMMAND_UNEXEMPT_DESCRIPTION'),
            usage: '[Member | Channel | Role]',
            permissions: 'ADMINISTRATOR',
            category: 'settings'
        })
    }

    async run(msg) {

        let target = msg.users;
        if (!target?.length) target = msg.channels;
        if (!target?.length) target = msg.roles;
        if (!target?.length) return this.client.commands.get('exempt')._list(msg);
        else target = target[0];

        const type = target instanceof User
			? 'users'
			: target instanceof Role
				? 'roles'
				: 'channels';
        const mod = await msg.guild.settings.get(`mod.exempt.${type}`);
        if (!mod?.includes(target.id)) return msg.responder.error('COMMAND_UNEXEMPT_NOEXIST', target.name || target.tag, type);
        msg.guild.settings.pull(`mod.exempt.${type}`, target.id);
        return msg.responder.success();
    }
}