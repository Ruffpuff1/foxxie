module.exports = {
    name: 'anti',
    aliases: ['auto', 'am', 'automod'],
    usage: 'fox anti (invite) (on|off|clear)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { lang, message, args, language } = props
        const loading = await language.send("MESSAGE_LOADING", lang);

        if (/(reset|clear)/i.test(args[0])) return _clearAnti();
        if (/(invite|invites)/i.test(args[0])) return _Anti('invite');
        language.send('COMMAND_ANTI_INVALIDUSE', lang); return loading.delete();

        async function _clearAnti() {

            function confirmed() {

                message.guild.settings.unset("mod.anti");
                loading.delete();
                return message.responder.success();
            }
            loading.confirm(loading, 'COMMAND_ANTI_CONFIRM', lang, message, confirmed);                         
        }

        async function _Anti(setting) {

            if (/(on|enable)/i.test(args[1])) {
                language.send('COMMAND_ANTI_ENABLED', lang, setting);
                loading.delete();
                return message.guild.settings.set(`mod.anti.${setting}`, true);
            }
            if (/(off|disable)/i.test(args[1])) {
                language.send('COMMAND_ANTI_DISABLED', lang, setting);
                loading.delete();
                return message.guild.settings.unset(`mod.anti.${setting}`);
            }
            state = await message.guild.settings.get(`mod.anti.${setting}`);
            language.send('COMMAND_ANTI_CURRENT', lang, setting, state);
            return loading.delete();
        }
    }
}