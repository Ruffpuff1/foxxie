module.exports = {
    name: 'welcome',
    aliases: ['ws', 'welcomesettings'],
    usage: 'fox welcome [channel|message] (none|#channel|message)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    async execute (props) {

        let { message, args } = props

        const loading = await message.responder.loading();
        const welcome = await message.guild.settings.get('welcome');
        if (/(channel|location|c)/i.test(args[0])) return this._channel(props, welcome, loading);
        if (/(message|text|m)/i.test(args[0])) return this._message(props, welcome, loading);
        message.responder.error('COMMAND_WELCOME_INVALIDUSE');
        loading.delete();
    }, 

    async _channel({ message, args }, welcome, loading) {

        if (/(none|reset)/i.test(args[1])) {
            message.responder.success('COMMAND_WELCOME_CHANNEL_REMOVED');
            loading.delete();
            return message.guild.settings.unset('welcome.channel');
        }
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[1]);
        if (!channel) {

            if (!welcome.channel) {
                message.responder.error('COMMAND_WELCOME_CHANNEL_NOCHANNEL');
                return loading.delete();
            }
            message.responder.success('COMMAND_WELCOME_CHANNEL_NOW', welcome.channel);
            return loading.delete();
        }
        await message.guild.settings.set('welcome.channel', channel);
        message.responder.success('COMMAND_WELCOME_CHANNEL_SET', channel);
        return loading.delete();
    },

    async _message({ message, args }, welcome, loading) {

        if (/(none|reset)/i.test(args[1])) {
            message.responder.success('COMMAND_WELCOME_MESSAGE_REMOVED');
            loading.delete();
            return message.guild.settings.unset('welcome.message');
        }
        const msg = args.slice(1).join(" ");
        if (!msg) {

            if (!welcome.message) {
                message.responder.error('COMMAND_WELCOME_MESSAGE_NOMESSAGE');
                return loading.delete();
            }
            message.responder.success('COMMAND_WELCOME_MESSAGE_NOW', welcome.message);
            return loading.delete();
        }
        await message.guild.settings.set('welcome.message', msg);
        message.responder.success('COMMAND_WELCOME_MESSAGE_SET', msg);
        return loading.delete();
    }
}