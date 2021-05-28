module.exports = {
    name: 'starboard',
    aliases: ['sb', 'star', 'starboardsettings'],
    usage: 'fox starboard [channel|minimum|self|notifs] (setting)',
    permissions: 'ADMINISTRATOR',
    category: 'settings',
    async execute (props) {

        const { message, args, language, lang } = props;
        const loading = await language.send("MESSAGE_LOADING", lang);
        const starboard = await message.guild.settings.get('starboard');

        if (/(channel|location|c)/i.test(args[0])) return this._channel(props, starboard, loading);
        if (/(minimum|number|min|m)/i.test(args[0])) return this._minimum(props, starboard, loading);
        if (/(notifs|n)/i.test(args[0])) return this._notifications(props, starboard, loading);
        if (/(selfstar|self|s)/i.test(args[0])) return this._self(props, starboard, loading);
        language.send('COMMAND_STARBOARD_INVALIDUSE', lang);
        return loading.delete();
    },

    async _channel({ message, args, language, lang }, starboard, loading) {

        if (/(none|reset)/i.test(args[1])) {
            language.send('COMMAND_STARBOARD_CHANNEL_REMOVED', lang);
            loading.delete();
            return message.guild.settings.unset('starboard.channel');
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[1]);
        if (!channel) {

            if (!starboard?.channel) {
                language.send('COMMAND_STARBOARD_CHANNEL_NOCHANNEL', lang);
                return loading.delete();
            }
            language.send('COMMAND_STARBOARD_CHANNEL_NOW', lang, starboard.channel);
            return loading.delete();
        }
        await message.guild.settings.set('starboard.channel', channel);
        language.send('COMMAND_STARBOARD_CHANNEL_SET', lang, channel);
        return loading.delete();
    },

    async _minimum({ message, args, language, lang }, starboard, loading) {

        if (/(none|reset)/i.test(args[1])) {
            language.send('COMMAND_STARBOARD_MINIMUM_REMOVED', lang);
            loading.delete();
            return message.guild.settings.unset('starboard.minimum');
        }
        const minimum = args[1];
        if (!minimum || !/^\d+$/.test(minimum)) {

            language.send('COMMAND_STARBOARD_MINIMUM_NOW', lang, starboard?.minimum || 3);
            return loading.delete();
        }
        await message.guild.settings.set('starboard.minimum', parseInt(minimum));
        language.send('COMMAND_STARBOARD_MINIMUM_SET', lang, parseInt(minimum));
        return loading.delete();
    },

    async _self({ message, args, language, lang }, starboard, loading) {

        if (/(none|reset|on|true|allow|yes)/i.test(args[1])) {
            language.send('COMMAND_STARBOARD_SELF_REMOVED', lang);
            loading.delete();
            return message.guild.settings.unset('starboard.self');
        }
        if (/(false|off|deny|no)/i.test(args[1])) {
            message.guild.settings.set('starboard.self', false);
            language.send('COMMAND_STARBOARD_SELF_DENIED', lang);
            return loading.delete();
        }
        language.send('COMMAND_STARBOARD_SELF_NOW', lang, starboard?.self);
        return loading.delete();
    },

    async _notifications({ message, args, language, lang }, starboard, loading) {
        console.log(args)
        if (/(none|reset|on|true|allow|yes)/i.test(args[1])) {
            language.send('COMMAND_STARBOARD_NOTIFICATIONS_REMOVED', lang);
            loading.delete();
            return message.guild.settings.unset('starboard.notifications');
        }
        if (/(false|off|deny|no)/i.test(args[1])) {
            message.guild.settings.set('starboard.notifications', false);
            language.send('COMMAND_STARBOARD_NOTIFICATIONS_DENIED', lang);
            return loading.delete();
        }
        language.send('COMMAND_STARBOARD_NOTIFICATIONS_NOW', lang, starboard?.notifications);
        return loading.delete();
    }
}