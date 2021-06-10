const { code, Monitor } = require('foxxie');
const { prefix: { production, development } } = require('../../config/foxxie');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            monitor: 'commandHandler',
            ignoreBlacklistedUsers: true
        })
    }

    async run(msg) {
        if (msg.guild && !msg.guild.me) await msg.guild.members.fetch(this.client.user);
		//if (!msg.channel.postable) return undefined;
        const settings = await msg.guild.settings.get();
        let prefixes = [`<@!${msg.client.user.id}>`, `<@${msg.client.user.id}>`, msg.client.development ? 'dev' : 'fox'];

        if (!settings?.prefixes.length) prefixes.push(msg.client.development ? development : production);
        else settings.prefixes.forEach(p => prefixes.push(p));

        if (settings?.blockedUsers?.includes(msg.author.id)) return undefined;
        if (new RegExp(`^<@!?${msg.client.user.id}>$`).test(msg.content)) {
            prefixes.shift();
            prefixes.shift();
            msg.responder.success("PREFIX_REMINDER", prefixes.slice(0, -1).map(p => `${code`${p}`}`).join(", "), prefixes.pop());
        };

        prefixes = [...new Set(prefixes)];
        prefixes.forEach(prefix => {
            if (msg.content.startsWith(prefix)) return this._commandExecute(prefix, msg);
        });
    }

    _commandExecute(prefix, msg) {

        try {
            const args = msg.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            let command = msg.client.commands.get(commandName);
            if (!command) return msg.client.emit('commandUnknown', msg, commandName);

            try {
                msg.client.inhibitors.get('permissions').execute(command, msg);
            } catch (error) {
                if (error == true) return undefined;
                else return msg.responder.error(error, command.permissions?.toLowerCase()?.replace(/_/g, ' '));
            }
            command.run(msg, args);
        } catch (error) {
            msg.responder.error('ERROR_GENERIC', error);
            return undefined;
        }
    }
}