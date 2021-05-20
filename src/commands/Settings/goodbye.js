module.exports = {
    name: 'goodbye',
    aliases: ['gs', 'goodbyesettings'],
    usage: 'fox goodbye [channel|message] (none|#channel|message)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { message, args, language, lang} = props;

        const loading = await language.send("MESSAGE_LOADING", lang);
        const goodbye = await message.guild.settings.get('goodbye');
        if (/(channel|location|c)/i.test(args[0])) return this._channel(props, loading, goodbye);
        if (/(message|text|m)/i.test(args[0])) return this._message(props, loading, goodbye);
        language.send('COMMAND_GOODBYE_INVALIDUSE', lang);
        loading.delete();
    },

    async _message({ message, args, language, lang }, loading, goodbye) {

        if (/(none|reset)/i.test(args[1])) {
            language.send('COMMAND_GOODBYE_MESSAGE_REMOVED', lang);
            loading.delete();
            return message.guild.settings.unset('goodbye.message');
        }
        const msg = args.slice(1).join(" ");
        if (!msg) {

            if (!goodbye.message) {
                language.send('COMMAND_GOODBYE_MESSAGE_NOMESSAGE', lang);
                return loading.delete();
            }
            language.send('COMMAND_GOODBYE_MESSAGE_NOW', lang, goodbye.message);
            return loading.delete();
        }
        await message.guild.settings.set('goodbye.message', msg);
        language.send('COMMAND_GOODBYE_MESSAGE_SET', lang, msg);
        return loading.delete();
    },

    async _channel({ message, args, language, lang }, loading, goodbye) {

        if (/(none|reset)/i.test(args[1])) {
            language.send('COMMAND_GOODBYE_CHANNEL_REMOVED', lang);
            loading.delete();
            return message.guild.settings.unset('goodbye.channel');
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[1]);
        if (!channel) {

            if (!goodbye.channel) {
                language.send('COMMAND_GOODBYE_CHANNEL_NOCHANNEL', lang);
                return loading.delete();
            }
            language.send('COMMAND_GOODBYE_CHANNEL_NOW', lang, goodbye.channel);
            return loading.delete();
        }
        await message.guild.settings.set('goodbye.channel', channel);
        language.send('COMMAND_GOODBYE_CHANNEL_SET', lang, channel);
        return loading.delete();
    }
}