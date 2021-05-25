module.exports = {
    name: 'embed',
    aliases: ['broadcast', 'bc', 'announce', 'broadcasts', 'announcements'],
    usage: 'fox embed (channel) { "title": "Embed Title" }',
    category: 'utility',
    permissions: 'ADMINISTRATOR',
    execute: async (props) => {

        let { lang, message, args, language } = props;

        let targetChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (targetChannel) args.shift()
        if (!targetChannel) targetChannel = message.channel

        let loading = await await language.send('MESSAGE_LOADING', lang);

        try {
            const json = JSON.parse(args.join(' '))
            targetChannel.send(json)
            message.delete()
            loading.delete()
        } catch (error) {
            loading.delete()
            language.send('COMMAND_EMBED_ERROR', lang)
        }
    }
}