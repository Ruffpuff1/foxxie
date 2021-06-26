const { Command } = require('@foxxie/tails');
const { User, Role } = require('discord.js')

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'exempt',
            aliases: ['ignore'],
            description: language => language.get('COMMAND_EXEMPT_DESCRIPTION'),
            usage: '[Member | Channel | Role]',
            permissions: 'ADMINISTRATOR',
            category: 'settings'
        })
    }

    async run(msg) {

        let target = msg.users;
        if (!target?.length) target = msg.channels;
        if (!target?.length) target = msg.roles;
        if (!target?.length) return this._list(msg);
        else target = target[0];

        const type = target instanceof User
			? 'users'
			: target instanceof Role
				? 'roles'
				: 'channels';
        const mod = await msg.guild.settings.get(`mod.exempt.${type}`);
        if (mod?.includes(target.id)) return msg.responder.error('COMMAND_EXEMPT_DUPLICATE', target.name || target.tag, type);
        msg.guild.settings.push(`mod.exempt.${type}`, target.id);
        return msg.responder.success();
    }

    async _list(msg) {
        const array = [];
        const arr = [ msg.language.get('COMMAND_EXEMPT_GUILD', msg.guild.name) ];
        const exempt = await msg.guild.settings.get('mod.exempt');
        if (!exempt) return msg.responder.error('MESSAGE_INVALID_USE', this.usage);

        for (const exe of ['users', 'channels', 'roles']) {
            if (exempt[exe]) exempt[exe].forEach(e => {
                const target = this.client.users.cache.get(e) || msg.guild.roles.cache.get(e) || msg.guild.channels.cache.get(e);
                const type = target instanceof User
			        ? 'user'
			        : target instanceof Role
				        ? 'role'
				        : 'channel';

                if (target) array.push(msg.language.get('COMMAND_EXEMPT', target.name || target.tag, type));
            })
        }
        arr.push(array.join('\n'));
        msg.channel.send(arr.filter(a => !!a).length === 1
                            ? msg.language.get('MESSAGE_INVALID_USE', this.usage)
                            : arr.filter(a => !!a).join('\n\n'));
    }
}