module.exports = {
    name: "disboard",
    aliases: ['ds', 'disboardsettings'],
    usage: `fox disboard [message|channel] (none|#channel|message)`,
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    async execute (props) {

        let { message, args, language, lang} = props;
        const loading = await language.send("MESSAGE_LOADING", lang);
        const disboard = await message.guild.settings.get('disboard');
        if (/(channel|location|c)/i.test(args[0])) return this._channel(props, disboard, loading);
        if (/(message|text|m)/i.test(args[0])) return this._message(props, disboard, loading);
        language.send('COMMAND_DISBOARD_INVALIDUSE', lang);
        return loading.delete();

    },

    async _channel({ message, args, language, lang }, disboard, loading) {

        if (/(none|reset)/i.test(args[1])) {
            language.send('COMMAND_DISBOARD_CHANNEL_REMOVED', lang);
            loading.delete();
            return message.guild.settings.unset('disboard.channel');
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[1]);
        if (!channel) {

            if (!disboard.channel) {
                language.send('COMMAND_DISBOARD_CHANNEL_NOCHANNEL', lang);
                return loading.delete();
            }
            language.send('COMMAND_DISBOARD_CHANNEL_NOW', lang, disboard.channel);
            return loading.delete();
        }
        await message.guild.settings.set('disboard.channel', channel);
        language.send('COMMAND_DISBOARD_CHANNEL_SET', lang, channel);
        return loading.delete();
    },

    async _message({ message, args, language, lang}, disboard, loading) {

        if (/(none|reset)/i.test(args[1])) {
            language.send('COMMAND_DISBOARD_MESSAGE_REMOVED', lang);
            loading.delete();
            message.guild.settings.unset('disboard.ping');
            return message.guild.settings.unset('disboard.message');
        }
        const msg = args.slice(1).join(" ");
        if (!msg) {

            if (!disboard.message) {
                language.send('COMMAND_DISBOARD_MESSAGE_NOMESSAGE', lang);
                return loading.delete();
            }
            language.send('COMMAND_DISBOARD_MESSAGE_NOW', lang, disboard.message);
            return loading.delete();
        }

        const ping = message.mentions.roles.first();
        if (!ping) message.guild.settings.unset('disboard.ping');
        if (ping) message.guild.settings.set('disboard.ping', ping);
        await message.guild.settings.set('disboard.message', msg);
        language.send('COMMAND_DISBOARD_MESSAGE_SET', lang, msg);
        return loading.delete();
    }   
}