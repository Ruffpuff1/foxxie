const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'log',
            aliases: ['log-channel', 'lc'],
            description: language => language.get('COMMAND_LOG_DESCRIPTION'),
            usage: '[mod | edit | delete | reset] (Channel | none)',
            permissions: 'ADMINISTRATOR',
            category: 'settings'
        })
    }

    run(msg, args) {
        const use = args.shift();
        if (/moderation|mod/i.test(use)) return this.settings(msg, args, 'mod');
        if (/(edit|editing)/i.test(use)) return this.settings(msg, args, 'edit');
        if (/(delete|deleting)/i.test(use)) return this.settings(msg, args, 'delete');
        if (/(member|members)/i.test(use)) return this.settings(msg, args, 'member');
        if (/(reset|none)/i.test(use)) return this.reset(msg);
        return msg.responder.error('COMMAND_LOG_INVALID');
    }

    async reset(msg) {
        const { guild, responder } = msg;
        const loading = await responder.loading();

        function confirmed() {
            guild.settings.unset('log');
            responder.success();
            return loading.delete();
        }
        return loading.confirm(loading, 'COMMAND_LOG_RESET', msg, confirmed);
    }

    async settings({ guild, channels, responder }, [use], setting) {
        const loading = await responder.loading();
        const logger = await guild.settings.get(`log.${setting}.channel`);
        const channel = channels.shift();

        if (/(remove|none|off)/i.test(use)) {
            await guild.settings.unset(`log.${setting}`);
            responder.success(`COMMAND_LOG_REMOVED`, setting);
            return loading.delete();

        } else if (!channel && !logger) {
            responder.error(`COMMAND_LOG_NOCHANNEL`, setting);
            return loading.delete();

        } else if (!channel) {
            responder.info(`COMMAND_LOG_NOW`, setting, guild.channels.cache.get(logger)?.toString());
            return loading.delete();

        } else {
            await guild.settings.set(`log.${setting}.channel`, channel.id);
            responder.success(`COMMAND_LOG_SET`, setting, channel.toString());
            return loading.delete();
        }
    }
}