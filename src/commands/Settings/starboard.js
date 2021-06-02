module.exports = {
    name: 'starboard',
    aliases: ['sb', 'star', 'starboardsettings'],
    usage: 'fox starboard [channel|minimum|self|notifs] (setting)',
    permissions: 'ADMINISTRATOR',
    category: 'settings',
    async execute (props) {

        const { message, args } = props;
        const loading = await message.responder.loading();
        const starboard = await message.guild.settings.get('starboard');

        if (/(channel|location|c)/i.test(args[0])) return this._channel(props, starboard, loading);
        if (/(minimum|number|min|m)/i.test(args[0])) return this._minimum(props, starboard, loading);
        if (/(notifs|n)/i.test(args[0])) return this._notifications(props, starboard, loading);
        if (/(selfstar|self|s)/i.test(args[0])) return this._self(props, starboard, loading);
        message.responder.error('COMMAND_STARBOARD_INVALIDUSE');
        return loading.delete();
    },

    async _channel({ message, args }, starboard, loading) {

        if (/(none|reset)/i.test(args[1])) {
            message.responder.success('COMMAND_STARBOARD_CHANNEL_REMOVED');
            loading.delete();
            return message.guild.settings.unset('starboard.channel');
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[1]);
        if (!channel) {

            if (!starboard?.channel) {
                message.responder.error('COMMAND_STARBOARD_CHANNEL_NOCHANNEL');
                return loading.delete();
            }
            message.responder.success('COMMAND_STARBOARD_CHANNEL_NOW', starboard.channel);
            return loading.delete();
        }
        await message.guild.settings.set('starboard.channel', channel);
        message.responder.success('COMMAND_STARBOARD_CHANNEL_SET', channel);
        return loading.delete();
    },

    async _minimum({ message, args }, starboard, loading) {

        if (/(none|reset)/i.test(args[1])) {
            message.responder.success('COMMAND_STARBOARD_MINIMUM_REMOVED');
            loading.delete();
            return message.guild.settings.unset('starboard.minimum');
        }
        const minimum = args[1];
        if (!minimum || !/^\d+$/.test(minimum)) {

            message.responder.success('COMMAND_STARBOARD_MINIMUM_NOW', starboard?.minimum || 3);
            return loading.delete();
        }
        await message.guild.settings.set('starboard.minimum', parseInt(minimum));
        message.responder.success('COMMAND_STARBOARD_MINIMUM_SET', parseInt(minimum));
        return loading.delete();
    },

    async _self({ message, args }, starboard, loading) {

        if (/(none|reset|on|true|allow|yes)/i.test(args[1])) {
            message.responder.success('COMMAND_STARBOARD_SELF_REMOVED');
            loading.delete();
            return message.guild.settings.unset('starboard.self');
        }
        if (/(false|off|deny|no)/i.test(args[1])) {
            message.guild.settings.set('starboard.self', false);
            message.responder.error('COMMAND_STARBOARD_SELF_DENIED');
            return loading.delete();
        }
        message.responder.success('COMMAND_STARBOARD_SELF_NOW', starboard?.self);
        return loading.delete();
    },

    async _notifications({ message, args }, starboard, loading) {
        if (/(none|reset|on|true|allow|yes)/i.test(args[1])) {
            message.responder.success('COMMAND_STARBOARD_NOTIFICATIONS_REMOVED');
            loading.delete();
            return message.guild.settings.unset('starboard.notifications');
        }
        if (/(false|off|deny|no)/i.test(args[1])) {
            message.guild.settings.set('starboard.notifications', false);
            message.responder.error('COMMAND_STARBOARD_NOTIFICATIONS_DENIED');
            return loading.delete();
        }
        message.responder.success('COMMAND_STARBOARD_NOTIFICATIONS_NOW', starboard?.notifications);
        return loading.delete();
    }
}