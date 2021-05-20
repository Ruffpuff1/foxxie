module.exports = {
    name: 'log',
    aliases: ['logging', 'logchannel', 'lc'],
    usage: `fox log [mod|edit|delete|reset] (#channel|none)`,
    permissions: 'ADMINISTRATOR',
    category: 'settings',
    execute: async function (props) {

        let { lang, args, language } = props

        const loading = await language.send("MESSAGE_LOADING", lang);
        if (/(moderation|mod)/i.test(args[0])) return this._settings(props, loading, 'mod');
        if (/(edit|editing)/i.test(args[0])) return this._settings(props, loading, 'edit');
        if (/(delete|deleting)/i.test(args[0])) return this._settings(props, loading, 'delete');
        if (/(reset|none)/i.test(args[0])) return this._resetSettings(props, loading);
        loading.delete();
        return language.send('COMMAND_LOG_INVALIDUSE', lang);

    },

    async _resetSettings({ message, lang }, loading) {

        const { guild } = message;

        function confirmed() {

            guild.settings.unset('log');
            loading.delete();
            return message.responder.success();
        }
        return loading.confirm(loading, 'COMMAND_LOG_CONFIRM', lang, message, confirmed)
    },

    async _settings({ message, args, lang, language }, loading, setting) {

        const { guild } = message;

        if (/(remove|none|off)/i.test(args[1])) {

            guild.settings.unset(`log.${setting}`);
            language.send(`COMMAND_LOG_${setting.toUpperCase()}_REMOVED`, lang);
            return loading.delete();
        }

        const channel = message.mentions.channels.first() || guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name === args[1]);
        if (!channel) {

            let channelId = await guild.settings.get(`log.${setting}.channel`);
            if (!channelId) {

                language.send(`COMMAND_LOG_${setting.toUpperCase()}_NOCHANNEL`, lang);
                return loading.delete();
            }
            language.send(`COMMAND_LOG_${setting.toUpperCase()}_NOW`, lang, channelId);
            return loading.delete();
        }

        await guild.settings.set(`log.${setting}.channel`, channel.id);
        language.send(`COMMAND_LOG_${setting.toUpperCase()}_SET`, lang, channel);
        return loading.delete();
    }
}