module.exports = {
    name: 'anti',
    aliases: ['auto', 'am', 'automod'],
    usage: 'fox anti (invite) (on|off|clear)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    async execute (props) {

        let { args } = props
        const loading = await message.responder.loading();

        if (/(reset|clear)/i.test(args[0])) return this._clearAnti(props, loading);
        if (/(invite|invites)/i.test(args[0])) return this._Anti(props, loading, 'invite');
        message.responder.error('COMMAND_ANTI_INVALIDUSE'); return loading.delete();
    },

    async _Anti({ message, args }, loading, setting) {

        if (/(on|enable)/i.test(args[1])) {
            message.responder.success('COMMAND_ANTI_ENABLED', setting);
            loading.delete();
            return message.guild.settings.set(`mod.anti.${setting}`, true);
        }
        if (/(off|disable)/i.test(args[1])) {
            message.responder.success('COMMAND_ANTI_DISABLED', setting);
            loading.delete();
            return message.guild.settings.unset(`mod.anti.${setting}`);
        }
        state = await message.guild.settings.get(`mod.anti.${setting}`);
        message.responder.success('COMMAND_ANTI_CURRENT', setting, state);
        return loading.delete();
    },

    async _clearAnti({ message }, loading) {

        function confirmed() {

            message.guild.settings.unset("mod.anti");
            loading.delete();
            return message.responder.success();
        }
        loading.confirm(loading, 'COMMAND_ANTI_CONFIRM', message, confirmed);                         
    }
}