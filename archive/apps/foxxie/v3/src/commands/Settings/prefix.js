const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'prefix',
            aliases: ['setprefix', 'prefixes'],
            description: language => language.get('COMMAND_PREFIX_DESCRIPTION'),
            usage: '(Prefix | none | remove) (Prefix)',
            category: 'settings'
        });

        this.permissions = 'ADMINISTRATOR';
    }

    async run(msg, args) {

        const loading = await msg.responder.loading();

        if (/(none|reset|clear)/i.test(args[0])) {
            async function confirmed() {
                msg.guild.settings.unset('prefixes');
                msg.responder.success();
                return loading.delete();
            }
            return loading.confirm(loading, 'COMMAND_PREFIX_CONFIRM', msg, confirmed);
        };

        if (/remove/i.test(args[0])) {
            const prefix = args[1];
            const prefixes = await msg.guild.settings.get('prefixes');

            if (!prefix) {
                msg.responder.error('COMMAND_PREFIX_NOPREFIX');
                return loading.delete();
            }

            if (!prefixes?.some(prfx => prfx === prefix)) {
                msg.responder.error('COMMAND_PREFIX_NOEXIST', prefix);
                return loading.delete();
            }

            await msg.guild.settings.pull('prefixes', prefix);
            msg.responder.success('COMMAND_PREFIX_REMOVED', prefix);
            return loading.delete();
        };

        const prefix = args[0];
        let prefixes = await msg.guild.settings.get('prefixes');
        if (!prefix) {

            if (!prefixes?.length) {
                msg.responder.error('COMMAND_PREFIX_NONE');
                return loading.delete();
            }
            msg.responder.info('COMMAND_PREFIX_DISPLAY', prefixes, prefixes.slice(0, -1).map(p => `\`${p}\``).join(", "));
            return loading.delete();
        }
        
        if (prefixes?.length >= 4) {
            msg.responder.error('COMMAND_PREFEX_MANY');
            return loading.delete();
        }

        msg.guild.settings.push('prefixes', prefix);
        msg.responder.success('COMMAND_PREFIX_ADDED', prefix);
        return loading.delete();
    }
}