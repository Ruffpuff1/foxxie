module.exports = {
    name: 'embed',
    aliases: ['broadcast', 'bc', 'announce', 'broadcasts', 'announcements'],
    usage: 'fox embed (channel) { "title": "Embed Title" }',
    category: 'utility',
    permissions: 'ADMINISTRATOR',
    execute: async (props) => {

        let { message, args } = props;

        let targetChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (targetChannel) args.shift()
        if (!targetChannel) targetChannel = message.channel

        try {
            const json = JSON.parse(args.join(' '))
            targetChannel.send(json)
            message.delete()
        } catch (error) {
            message.responder.error('COMMAND_EMBED_ERROR')
        }
    }
}