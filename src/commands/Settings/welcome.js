module.exports = {
    name: 'welcome',
    aliases: ['ws', 'welcomesettings'],
    usage: 'fox welcome [channel|message] (none|#channel|message)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { message, args, lang, language } = props

        const loading = await language.send("MESSAGE_LOADING", lang);
        const welcome = await message.guild.settings.get('welcome');
        if (/(channel|location|c)/i.test(args[0])) return _channel();
        if (/(message|text|m)/i.test(args[0])) return _message();
        language.send('COMMAND_WELCOME_INVALIDUSE', lang);
        loading.delete();

        async function _channel() {

            if (/(none|reset)/i.test(args[1])) {
                language.send('COMMAND_WELCOME_CHANNEL_REMOVED', lang);
                loading.delete();
                return message.guild.settings.unset('welcome.channel');
            }
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args[1]);
            if (!channel) {

                if (!welcome.channel) {
                    language.send('COMMAND_WELCOME_CHANNEL_NOCHANNEL', lang);
                    return loading.delete();
                }
                language.send('COMMAND_WELCOME_CHANNEL_NOW', lang, welcome.channel);
                return loading.delete();
            }
            await message.guild.settings.set('welcome.channel', channel);
            language.send('COMMAND_WELCOME_CHANNEL_SET', lang, channel);
            return loading.delete();
        }
        async function _message() {

            if (/(none|reset)/i.test(args[1])) {
                language.send('COMMAND_WELCOME_MESSAGE_REMOVED', lang);
                loading.delete();
                return message.guild.settings.unset('welcome.message');
            }
            const msg = args.slice(1).join(" ");
            if (!msg) {

                if (!welcome.message) {
                    language.send('COMMAND_WELCOME_MESSAGE_NOMESSAGE', lang);
                    return loading.delete();
                }
                language.send('COMMAND_WELCOME_MESSAGE_NOW', lang, welcome.message);
                return loading.delete();
            }
            await message.guild.settings.set('welcome.message', msg);
            language.send('COMMAND_WELCOME_MESSAGE_SET', lang, msg);
            return loading.delete();
        }
    }
}