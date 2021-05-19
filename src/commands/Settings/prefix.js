module.exports = {
    name: 'prefix',
    aliases: ['setprefix', 'prefixes'],
    usage: 'fox prefix (none|prefix)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { lang, message, args, language } = props
        const loading = await language.send("MESSAGE_LOADING", lang);

        if (/(none|reset)/i.test(args[0])) {

            function confirmed() {

                message.guild.settings.unset('prefixes');
                loading.delete();
                return message.responder.success();
            }
            return loading.confirm(loading, 'COMMAND_PREFIX_CONFIRM', lang, message, confirmed);
        }

        let prefix = args[0]
        if (!prefix) {
            let prefixes = await message.guild.settings.get('prefixes')

            if (!prefixes?.length) {
                language.send('COMMAND_PREFIX_NONE', lang);
                return loading.delete();
            }

            language.send('COMMAND_PREFIX_NOW', lang, prefixes, prefixes.slice(0, -1).map(p => `\`${p}\``).join(", "));
            return loading.delete();
        }

        message.guild.settings.push('prefixes', prefix)
        language.send('COMMAND_PREFIX_ADDED', lang, prefix);
        return loading.delete();
    }
}