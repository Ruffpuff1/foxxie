module.exports = {
    name: 'anti',
    aliases: ['auto', 'am', 'automod'],
    usage: 'fox anti (invite) (on|off|clear)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    async execute (props) {

        let { lang, args, language } = props
        const loading = await language.send("MESSAGE_LOADING", lang);

        if (/(reset|clear)/i.test(args[0])) return this._clearAnti(props, loading);
        if (/(invite|invites)/i.test(args[0])) return this._Anti(props, loading, 'invite');
        language.send('COMMAND_ANTI_INVALIDUSE', lang); return loading.delete();
    },

    async _Anti({ message, args, lang, language }, loading, setting) {

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
    },

    async _clearAnti({ message, lang }, loading) {

        function confirmed() {

            message.guild.settings.unset("mod.anti");
            loading.delete();
            return message.responder.success();
        }
        loading.confirm(loading, 'COMMAND_ANTI_CONFIRM', lang, message, confirmed);                         
    }
}