module.exports = {
    name: "disboard",
    aliases: ['ds', 'disboardsettings'],
    usage: `fox disboard [message|channel] (none|#channel|message)`,
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    async execute (props) {

        let { message, args} = props;
        const loading = await message.responder.loading();
        const disboard = await message.guild.settings.get('disboard');
        if (/(channel|location|c)/i.test(args[0])) return this._channel(props, disboard, loading);
        if (/(message|text|m)/i.test(args[0])) return this._message(props, disboard, loading);
        message.responder.error('COMMAND_DISBOARD_INVALIDUSE');
        return loading.delete();

    },

    async _channel({ message, args }, disboard, loading) {

        if (/(none|reset)/i.test(args[1])) {
            message.responder.success('COMMAND_DISBOARD_CHANNEL_REMOVED');
            loading.delete();
            return message.guild.settings.unset('disboard.channel');
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[1]);
        if (!channel) {

            if (!disboard.channel) {
                message.responder.error('COMMAND_DISBOARD_CHANNEL_NOCHANNEL');
                return loading.delete();
            }
            message.responder.success('COMMAND_DISBOARD_CHANNEL_NOW', disboard.channel);
            return loading.delete();
        }
        await message.guild.settings.set('disboard.channel', channel);
        message.responder.success('COMMAND_DISBOARD_CHANNEL_SET', channel);
        return loading.delete();
    },

    async _message({ message, args}, disboard, loading) {

        if (/(none|reset)/i.test(args[1])) {
            message.responder.success('COMMAND_DISBOARD_MESSAGE_REMOVED');
            loading.delete();
            message.guild.settings.unset('disboard.ping');
            return message.guild.settings.unset('disboard.message');
        }
        const msg = args.slice(1).join(" ");
        if (!msg) {

            if (!disboard.message) {
                message.responder.error('COMMAND_DISBOARD_MESSAGE_NOMESSAGE');
                return loading.delete();
            }
            message.responder.success('COMMAND_DISBOARD_MESSAGE_NOW', disboard.message);
            return loading.delete();
        }

        const ping = message.mentions.roles.first();
        if (!ping) message.guild.settings.unset('disboard.ping');
        if (ping) message.guild.settings.set('disboard.ping', ping);
        await message.guild.settings.set('disboard.message', msg);
        message.responder.success('COMMAND_DISBOARD_MESSAGE_SET', msg);
        return loading.delete();
    }   
}