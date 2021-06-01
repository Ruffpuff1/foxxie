module.exports = {
    name: 'goodbye',
    aliases: ['gs', 'goodbyesettings'],
    usage: 'fox goodbye [channel|message] (none|#channel|message)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { message, args} = props;

        const loading = await message.responder.loading();
        const goodbye = await message.guild.settings.get('goodbye');
        if (/(channel|location|c)/i.test(args[0])) return this._channel(props, loading, goodbye);
        if (/(message|text|m)/i.test(args[0])) return this._message(props, loading, goodbye);
        message.responder.error('COMMAND_GOODBYE_INVALIDUSE');
        loading.delete();
    },

    async _message({ message, args }, loading, goodbye) {

        if (/(none|reset)/i.test(args[1])) {
            message.responder.success('COMMAND_GOODBYE_MESSAGE_REMOVED');
            loading.delete();
            return message.guild.settings.unset('goodbye.message');
        }
        const msg = args.slice(1).join(" ");
        if (!msg) {

            if (!goodbye.message) {
                message.responder.error('COMMAND_GOODBYE_MESSAGE_NOMESSAGE');
                return loading.delete();
            }
            message.responder.success('COMMAND_GOODBYE_MESSAGE_NOW', goodbye.message);
            return loading.delete();
        }
        await message.guild.settings.set('goodbye.message', msg);
        message.responder.success('COMMAND_GOODBYE_MESSAGE_SET', msg);
        return loading.delete();
    },

    async _channel({ message, args }, loading, goodbye) {

        if (/(none|reset)/i.test(args[1])) {
            message.responder.success('COMMAND_GOODBYE_CHANNEL_REMOVED');
            loading.delete();
            return message.guild.settings.unset('goodbye.channel');
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[1]);
        if (!channel) {

            if (!goodbye.channel) {
                message.responder.error('COMMAND_GOODBYE_CHANNEL_NOCHANNEL');
                return loading.delete();
            }
            message.responder.success('COMMAND_GOODBYE_CHANNEL_NOW', goodbye.channel);
            return loading.delete();
        }
        await message.guild.settings.set('goodbye.channel', channel);
        message.responder.success('COMMAND_GOODBYE_CHANNEL_SET', channel);
        return loading.delete();
    }
}