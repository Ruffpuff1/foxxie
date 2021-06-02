module.exports = {
    name: 'prefix',
    aliases: ['setprefix', 'prefixes'],
    usage: 'fox prefix (none|remove|prefix)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    async execute ({ message, args }) {

        const loading = await message.responder.loading();

        if (/(none|reset|clear)/i.test(args[0])) {

            function confirmed() {

                message.guild.settings.unset('prefixes');
                loading.delete();
                return message.responder.success();
            }
            return loading.confirm(loading, 'COMMAND_PREFIX_CONFIRM', message, confirmed);
        }

        if (/(remove)/i.test(args[0])) {
            let prefix = args[1];
            if (!prefix) {
                message.responder.error('COMMAND_PREFIX_REMOVE_NOARGS');
                return loading.delete();
            }
            const prefixes = await message.guild.settings.get('prefixes');
            if (!prefixes?.some(prfx => prfx === prefix)) {
                message.responder.error('COMMAND_PREFIX_REMOVE_NOEXIST', prefix);
                return loading.delete();
            }
            await message.guild.settings.pull('prefixes', prefix);
            message.responder.success('COMMAND_PREFIX_REMOVE_SUCCESS', prefix);
            return loading.delete();
        }

        let prefix = args[0]
        if (!prefix) {
            let prefixes = await message.guild.settings.get('prefixes')

            if (!prefixes?.length) {
                message.responder.error('COMMAND_PREFIX_NONE');
                return loading.delete();
            }

            message.responder.success('COMMAND_PREFIX_NOW', prefixes, prefixes.slice(0, -1).map(p => `\`${p}\``).join(", "));
            return loading.delete();
        }

        message.guild.settings.push('prefixes', prefix)
        message.responder.success('COMMAND_PREFIX_ADDED', prefix);
        return loading.delete();
    }
}